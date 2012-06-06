"use strict";
var fs = require('fs');
var path = require('path');
var errh = require('ncbt').errh;
var Canvas = require('canvas');
var Image = Canvas.Image;
var async = require('async');


var Grid = function (img) {
	this.img = img;

	this.size = { x: this.img.width, y: this.img.height };

	this.blockSizeRange = {
		min: { x: 40, y: 50 },
		max: { x: 60, y: 70 }
	};
	this.interval = 20;

	this.canvas = null;
	this.ctx = null;

	this.imgData = null;

	this.rows = [];
	this.y2row = {};

	this.calc();
};

Grid.prototype.calc = function () {
	this.drawImg();
	this.walk();
};

Grid.prototype.walk = function () {
	for (var i = 0; i < this.size.y; i++) {
		for (var j = 0; j < this.size.x; j++) {
			var pos = { x: j, y: i };
			var block = this.getBlock(pos);
			if (block) {
				if (block.size) {
					this.addToRow(block);
					j += block.size.x + 2;
				}
				else {
					j += block;
				}
			}
		}
		var row = this.y2row[i];
		if (row != null) {
			i += row.series[0][0].size.y + 2;
		}
	}
};

Grid.prototype.getBlock = function (pos) {
	var lineX = this.getLineX(pos, this.blockSizeRange.max.x);
	if (lineX >= this.blockSizeRange.min.x) {
		var lineY = this.getLineY(pos, this.blockSizeRange.max.y);
		if (lineY >= this.blockSizeRange.min.y) {
			var lineX2 = this.getLineX({ x: pos.x, y: pos.y + lineY - 1 }, this.blockSizeRange.max.x);
			var lineY2 = this.getLineY({ x: pos.x + lineX - 1, y: pos.y }, this.blockSizeRange.max.y);
			if (lineX == lineX2 && lineY == lineY2) {
				return {
					pos: { x: pos.x + 1, y: pos.y +1 },
					size: { x: lineX - 2, y: lineY - 2 }
				};
			}
		}
	}
	return lineX;
};

Grid.prototype.getLineX = function (pos, max) {
	var limit = Math.min(this.size.x, pos.x + max);
	for (var i = pos.x; i < limit; i++) {
		var c = this.getColor({ x: i, y: pos.y });
		if (!this.isBorderColor(c)) {
			return i - pos.x;
		}
	}
	return 0;
};

Grid.prototype.getLineY = function (pos, max) {
	var limit = Math.min(this.size.y, pos.y + max);
	for (var i = pos.y; i < limit; i++) {
		var c = this.getColor({ x: pos.x, y: i });
		if (!this.isBorderColor(c)) {
			return i - pos.y;
		}
	}
	return 0;
};

Grid.prototype.getColor = function (pos) {
	var d = this.imgData;
	if (d == null) {
		this.imgData = d = this.ctx.getImageData(0, 0, this.size.x, this.size.y);
	}
	var start = pos.y * this.size.x * 4 + pos.x * 4;
	d = d.data;
	return {
		r: d[start],
		g: d[start+1],
		b: d[start+2],
		a: d[start+3]
	};
};

Grid.prototype.isBorderColor = function (c) {
	return c.r == 31 && c.g == 31 && c.b == 31;
};

Grid.prototype.isBgColor = function (c) {
	return c.r == 255 && c.g == 255 && c.b == 255;
};

Grid.prototype.addToRow = function (block) {
	var row = this.y2row[block.pos.y];
	if (row == null) {
		row = {
			pos: block.pos,
			series: []
		};
		this.y2row[block.pos.y] = row;
		this.rows.push(row);
	}
	var serie = row.series.length > 0 ? row.series[row.series.length - 1] : null;
	var prevBlock = serie && serie.length > 0 ? serie[serie.length - 1] : null;
	if (serie == null || block.pos.x - prevBlock.pos.x - prevBlock.size.x > this.interval) {
		serie = [];
		row.series.push(serie);
	}
	serie.push(block);
};

Grid.prototype.drawImg = function () {
	var img = this.img;
	this.canvas = new Canvas(img.width, img.height);
	this.ctx = this.canvas.getContext('2d');
	this.ctx.drawImage(img, 0, 0);
};

Grid.prototype.draw = function (ctx) {
	for (var i = 0; i < this.rows.length; i++) {
		var row = this.rows[i];
		var rowColor = i % 2 ? 'green' : 'blue';
		for (var j = 0; j < row.series.length; j++) {
			var serie = row.series[j];
			ctx.strokeStyle = j % 2 ? 'red' : rowColor;
			for (var k = 0; k < serie.length; k++) {
				var block = serie[k];
				this.drawBlock(ctx, block);
			}
		}
	}
};

Grid.prototype.drawBlock = function (ctx, block) {
	ctx.strokeRect(block.pos.x+0.5, block.pos.y+0.5, block.size.x-1, block.size.y-1);
};


module.exports = Grid;
