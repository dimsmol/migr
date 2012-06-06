"use strict";
var inherits = require('util').inherits;
var Page = require('./page');


var Migr1 = function (data, opt_outPath) {
	Page.call(this, data, opt_outPath);
};
inherits(Migr1, Page);

Migr1.prototype.name = 'migr1';

Migr1.prototype.fillData = function () {
	this.drawData(2, 0, 'Фамилия');
	this.drawData(3, 0, 'Имя');
	this.drawData(3, 0, 'Отчество', this.data['Имя'] ? this.data['Имя'].length + 1 : 0);
	this.drawData(4, 0, 'Гражданство');
	this.drawDateData(5, 0, 'Дата рождения');
	var gender = this.data['Пол'];
	this.drawGender(5, 3, 5, 4, gender);
	var bp = this.data['Место рождения'];
	if (bp) {
		this.draw(6, 0, bp['Государство']);
		this.draw(7, 0, bp['Населенный пункт']);
	}
	var doc = this.data['Документ'];
	if (doc) {
		this.draw(8, 0, doc['Вид']);
		this.draw(8, 1, doc['Серия']);
		this.draw(8, 2, doc['Номер']);
		this.drawDate(9, 0, doc['Дата выдачи']);
		this.drawDate(9, 3, doc['Срок действия']);
	}
	var goal = {
		'служебная': 0,
		'туризм': 1,
		'деловая': 2,
		'учеба': 3,
		'работа': 4,
		'частная': 5,
		'транзит': 6,
		'гуманитарная': 7,
		'другая': 8
	}[this.data['Цель въезда']];
	if (goal != null) {
		this.draw(12, goal, 'X');
	}
	this.drawData(13, 0, 'Профессия');
	this.drawDateData(14, 0, 'Дата въезда');
	var tillDate = this.getTillDate();
	this.drawDate(14, 3, tillDate);
	var migrCard = this.data['Миграционная карта'];
	if (migrCard) {
		this.draw(15, 0, migrCard['Серия']);
		this.draw(15, 1, migrCard['Номер']);
	}

	// --------

	this.drawData(21, 0, 'Фамилия');
	this.drawData(22, 0, 'Имя');
	this.drawData(22, 0, 'Отчество', this.data['Имя'] ? this.data['Имя'].length + 1 : 0);
	this.drawData(23, 0, 'Гражданство');
	this.drawDateData(24, 0, 'Дата рождения');
	this.drawGender(24, 3, 24, 4, gender);

	if (doc) {
		this.draw(25, 0, doc['Вид']);
		this.draw(25, 1, doc['Серия']);
		this.draw(25, 2, doc['Номер']);
	}

	var address = this.data['Адрес'];
	if (address) {
		this.draw(28, 0, address['Населенный пункт']);
		this.draw(29, 0, address['Улица']);
		this.draw(30, 0, address['Дом']);
		this.draw(30, 1, address['Корпус']);
		this.draw(30, 2, address['Строение']);
		this.draw(30, 3, address['Квартира']);
	}
	this.drawDate(31, 0, tillDate);
};


module.exports = Migr1;
