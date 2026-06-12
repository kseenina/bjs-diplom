'use strict';
const logOut = new LogoutButton();
logOut.action = function() {
	ApiConnector.logout(function(response) {
		if(response.success) {
			location.reload();
		}
	});
};
ApiConnector.current(function(response) {
	if(response.success) {
		ProfileWidget.showProfile(response.data);
	}
});
const ratesBoard = new RatesBoard();

function refreshRatesBoard() {
	ApiConnector.getStocks(function(response) {
		if(response.success) {
			ratesBoard.clearTable();
			ratesBoard.fillTable(response.data);
		}
	});
}
refreshRatesBoard();
setInterval(refreshRatesBoard, 60000);
const moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = function(data) {
	ApiConnector.addMoney(data, function(response) {
		if(response.success) {
			ProfileWidget.showProfile(response.data);
			moneyManager.setMessage(true, 'Баланс успешно пополнен!');
		} else {
			moneyManager.setMessage(false, response.error);
		}
	});
}
moneyManager.conversionMoneyCallback = function(data) {
	ApiConnector.convertMoney(data, function(response) {
		if(response.success) {
			ProfileWidget.showProfile(response.data);
			moneyManager.setMessage(true, 'Конвертация произведена успешно!');
		} else {
			moneyManager.setMessage(false, response.error);
		}
	});
}
moneyManager.sendMoneyCallback = function(data) {
	ApiConnector.transferMoney(data, function(response) {
		if(response.success) {
			ProfileWidget.showProfile(response.data);
			moneyManager.setMessage(true, 'Перевод произведен успешно!');
		} else {
			moneyManager.setMessage(false, response.error);
		}
	});
}
const favoritesWidget = new FavoritesWidget();
ApiConnector.getFavorites(function(response) {
	if(response.success) {
		favoritesWidget.clearTable();
		favoritesWidget.fillTable(response.data);
		moneyManager.updateUsersList(response.data);
	}
});
favoritesWidget.addUserCallback = function(data) {
	ApiConnector.addUserToFavorites(data, function(response) {
		if(response.success) {
			favoritesWidget.clearTable();
			favoritesWidget.fillTable(response.data);
			moneyManager.updateUsersList(response.data);
			moneyManager.setMessage(true, 'Пользователь успешно добавлен в избранное!');
		} else {
			moneyManager.setMessage(false, response.error);
		}
	});
}
favoritesWidget.removeUserCallback = function(data) {
	ApiConnector.removeUserFromFavorites(data, function(response) {
		if(response.success) {
			favoritesWidget.clearTable();
			favoritesWidget.fillTable(response.data);
			moneyManager.updateUsersList(response.data);
			moneyManager.setMessage(true, 'Пользователь успешно удален из избранного!');
		} else {
			moneyManager.setMessage(false, response.error);
		}
	});
}