"use strict";
var fs = require('fs');
var path = require('path');
var errh = require('ncbt').errh;
var Canvas = require('canvas');
var Image = Canvas.Image;
var async = require('async');
var Grid = require('./grid');
var Abc = require('./abc');


var Page = function (data, opt_outPath) {
	this.data = data;
	this.outPath = opt_outPath || '.';

	this.abc = null;
	this.grid = null;
};

Page.prototype.name = null;

Page.prototype.getAbc = function (cb) {
	return new Abc(this.img, this.grid, [
		{ chars: 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ', row: 0 },
		{ chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', row: 1 },
		{ chars: '0123456789', row: 1, serie: 1 }
	]);
};

Page.prototype.fill = function (cb) {
	this.render(false, cb);
};

Page.prototype.test = function (cb) {
	this.render(true, cb);
};

Page.prototype.render = function (isTest, cb) {
	var self = this;
	async.waterfall([
		function (cb) {
			self.readImg(cb);
		},
		function (cb) {
			self.grid = new Grid(self.img);
			self.abc = self.getAbc();
			self.drawImg();
			if (isTest) {
				self.grid.draw(self.ctx);
			}
			else {
				self.fillData();
			}
			self.saveImg(isTest, cb);
		}], cb);
};

Page.prototype.readImg = function (cb) {
	var self = this;
	fs.readFile(
		path.join(__dirname, '..', 'blanks', this.name+'.png'),
		errh(function(src, cb) {
			self.img = new Image();
			self.img.onload = function () {
				cb();
			};
			self.img.onerror = function (err) {
				cb(err);
			};
			self.img.src = src;
		}, cb));
};

Page.prototype.drawImg = function () {
	this.canvas = new Canvas(this.img.width, this.img.height);
	this.ctx = this.canvas.getContext('2d');
	this.ctx.drawImage(this.img, 0, 0);
};

Page.prototype.saveImg = function (isTest, cb) {
	var out = fs.createWriteStream(path.join(this.outPath, this.name+(isTest?'-test':'')+'.png'));
	var stream = this.canvas.createPNGStream();
	stream.on('data', function (chunk){
		out.write(chunk);
	});
	stream.on('error', function (err){
		cb(err);
	});
	stream.on('end', function (){
		cb();
	});
};

Page.prototype.fillData = function () {
};

Page.prototype.getTillDate = function () {
	var result = this.data['Срок пребывания'];
	if (result == 'default') {
		result = this.toDate(this.data['Дата въезда']);
		if (result.length === 0) {
			return null;
		}
		// 90 days by default
		var d = new Date(Date.UTC(result[2], result[1], result[0]) + 90 * 24 * 60 * 60 * 1000);
		result = [
			this.zero2(d.getUTCDate()),
			this.zero2(d.getUTCMonth()),
			d.getUTCFullYear()
		].join('.');
	}
	return result;
};

Page.prototype.zero2 = function (v) {
	v = '' + v;
	if (v.length == 1) {
		v = '0' + v;
	}
	return v;
};

Page.prototype.toDate = function (v) {
	return v ? v.split('.') : [];
};

Page.prototype.drawDateData = function (row, serie, dataKey) {
	this.drawDate(row, serie, this.data[dataKey]);
};

Page.prototype.drawDate = function (row, serie, date) {
	if (date) {
		date = this.toDate(date);
		for (var i = 0; i < 3; i++) {
			this.draw(row, serie + i, date[i]);
		}
	}
};

Page.prototype.drawGender = function (rowM, serieM, rowF, serieF, gender) {
	if (gender) {
		switch (gender) {
			case 'М':
				this.draw(rowM, serieM, 'X');
				break;
			case 'Ж':
				this.draw(rowF, serieF, 'X');
				break;
			default:
				console.log('WARN unknown Пол:', gender);
		}
	}
};

Page.prototype.drawData = function (row, serie, dataKey, opt_offset) {
	this.draw(row, serie, this.data[dataKey], opt_offset);
};

Page.prototype.draw = function (row, serie, str, opt_offset) {
	if (str) {
		str = str.toUpperCase();
		this.abc.draw(this.ctx, this.grid.rows[row].series[serie], str, opt_offset);
	}
};


module.exports = Page;
