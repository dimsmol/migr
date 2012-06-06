"use strict";
var fs = require('fs');
var path = require('path');
var errh = require('ncbt').errh;
var Canvas = require('canvas');
var Image = Canvas.Image;


var Abc = function (img, grid, map) {
	this.img = img;
	this.grid = grid;
	this.map = this.rehash(map);
};

Abc.prototype.rehash = function (map) {
	var result = {};
	for (var i = 0; i < map.length; i++) {
		var mapEntry = map[i];
		var serie = this.grid.rows[mapEntry.row].series[mapEntry.serie || 0];
		var chars = mapEntry.chars;
		for (var j = 0; j < chars.length; j++) {
			if (j >= serie.length) {
				console.log('WARN abc range longer than serie:', chars);
				break;
			}
			var c = chars[j];
			result[c] = serie[j];
		};
	};
	return result;
};

Abc.prototype.draw = function (ctx, serie, str, opt_offset) {
	if (str) {
		for (var i = 0; i < str.length; i++) {
			var pos = i;
			if (opt_offset > 0) {
				pos += opt_offset;
			}
			if (pos >= serie.length) {
				console.log('WARN str longer than serie:', str);
				break;
			}
			var block = serie[pos];
			this.drawChar(ctx, block, str[i]);
		}
	}
};

Abc.prototype.drawChar = function (ctx, block, c) {
	if (c != ' ') {
		var cBlock = this.map[c];
		if (cBlock == null) {
			console.log('WARN no block for char:', c);
		}
		else {
			var size = {
				x: Math.min(cBlock.size.x, block.size.x),
				y: Math.min(cBlock.size.y, block.size.y)
			};
			ctx.drawImage(
				this.img,
				cBlock.pos.x, cBlock.pos.y, size.x, size.y,
				block.pos.x, block.pos.y, size.x, size.y);
		}
	}
};


module.exports = Abc;
