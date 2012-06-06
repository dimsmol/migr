"use strict";
var inherits = require('util').inherits;
var Page = require('./page');


var Migr2 = function (data, opt_outPath) {
	Page.call(this, data, opt_outPath);
};
inherits(Migr2, Page);

Migr2.prototype.name = 'migr2';

Migr2.prototype.fillData = function () {
	var address = this.data['Адрес'];
	if (address) {
		this.draw(2, 0, address['Область']);
		this.draw(3, 0, address['Район']);
		this.draw(4, 0, address['Населенный пункт']);
		this.draw(5, 0, address['Улица']);
		this.draw(6, 0, address['Дом']);
		this.draw(6, 1, address['Корпус']);
		this.draw(6, 2, address['Строение']);
		this.draw(6, 3, address['Квартира']);
		this.draw(6, 4, address['Телефон']);
	}

	var acceptor = this.data['Принимающая сторона'];
	if (acceptor) {
		var type = {
			'организация': 0,
			'физ': 1
		}[acceptor['Организация или физ']];
		if (type != null) {
			this.draw(7, type, 'X');
		}
		this.draw(8, 0, acceptor['Фамилия']);
		this.drawDate(8, 1, acceptor['Дата рождения']);
		this.draw(9, 0, acceptor['Имя']);
		this.draw(9, 0, acceptor['Отчество'], acceptor['Имя'] ? acceptor['Имя'].length + 1 : 0);
		var doc = acceptor['Документ'];
		if (doc) {
			this.draw(10, 0, doc['Вид']);
			this.draw(10, 1, doc['Серия']);
			this.draw(10, 2, doc['Номер']);
			this.drawDate(11, 0, doc['Дата выдачи']);
			this.drawDate(11, 3, doc['Срок действия']);
		}
	}

	if (address) {
		this.draw(12, 0, address['Область']);
		this.draw(13, 0, address['Район']);
		this.draw(14, 0, address['Населенный пункт']);
		this.draw(15, 0, address['Улица']);
		this.draw(16, 0, address['Дом']);
		this.draw(16, 1, address['Корпус']);
		this.draw(16, 2, address['Строение']);
		this.draw(16, 3, address['Квартира']);
		this.draw(16, 4, address['Телефон']);
	}

	if (acceptor) {
		this.draw(24, 0, acceptor['Фамилия']);
		this.draw(25, 0, acceptor['Имя']);
		this.draw(25, 0, acceptor['Отчество'], acceptor['Имя'] ? acceptor['Имя'].length + 1 : 0);
	}
};


module.exports = Migr2;
