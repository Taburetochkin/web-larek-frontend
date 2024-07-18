# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Описание базовых классов

### Класс Api

- Осуществляет взаимодействие с сервером.
- Отправляет get и post запросы для получения и отправки данных.

### Абстрактный Класс Component

- Базовый класс компонента.
- Методы: для переключения класса, изменения статуса блокировки и возвращения корневого DOM-элемент.

### Слой Model

#### Класс AppStateModel

- Наследует класс Model.
- Методы для добавления товаров в корзину, удаления их из корзины, очистки корзины, валидации форм и  проверки заполнения полей.

#### Абстрактный класс Model

- Абстрактный базовый класс, который используется для создания объекта хранения данных.

### Слой View

#### Класс Page

- Наследуется от абстрактного класса Component.
- Используется для отрисовки главной страницы.
- Методы вывода количества товаров в корзине, передачи в каталог массива карточек, установки класса блокировки прокрутки страницы при открытии модальных окон.

#### Класс Card

- Наследуется от абстрактного класса Component<ICard>.
- используется для отображения данных о товаре и установки основных свойств карточки товара.

#### Класс Basket

- Наследуется от абстрактного класса Component.
- Используется для представления корзины приложения.
- Свойства: productsList (список элементов в корзине), totalPrice (общая стоимость товаров), button (кнопка перехода на следующую стадию - оформление заказа).

#### Класс BasketCard

- Наследуется от абстрактного класса Component.
- Используется для представления карточки товара в корзине.
- Свойства: index (номер продукта в корзине), title (название товара), button (кнопка удаления), price (стоимость).

#### Класс Modal

- Наследуется от абстрактного класса Component.
- Содержит информацию отображения модального окна.
- Методы открытия и закрытия модального окна.

## Классы и методы

#### Класс Form

- Наследуется от абстрактного класса Component.
- Используется для описания базовой формы отправки данных.
- Содержит свойства:
  - submit: HTMLButtonElement;
  - errors: HTMLElement;

#### Класс OrderAddress

- Наследуется от класса Form.
- Устанавливает свойства:
  - paymentMethod: TPaymentType; (способ оплаты)
  - address: string; (адрес доставки)

#### Класс OrderContacts

- Наследуется от класса Form.
- Устанавливает свойства:
  - email: string; (почта для связи)
  - phone: string; (телефон для связи)

#### Класс Success

- Наследуется от абстрактного класса Component.
- Используется для отображения основной информации по завершенному заказу.
- Содержит свойства:
  - close: HTMLElement;
  - totalPayment: HTMLElement; (общая сумма заказа)

### Слой presenter

#### Класс EventEmitter

- Несет в себе функции слоя Представления.
- Используется для обеспечения работы событий приложения.
- Методы установки обработчика на событие и наоброт(2 разных метода), иницилизация события с данными и установка слушателя на все события и наоборот(2 разных метода)

#### Класс LarekApi

- Используется для обеспечения работы с конкретными данными с сервера.
- Методы:
  - getProductsList: () => Promise<IProduct[]>; получает информацию по всем доступным товарам
  - getProduct: (id: string) => Promise; получает информацию по конкретному товару
  - orderProducts: (order: IOrder) => Promise; оформление заказа через соответствующий запрос на сервер

## Используемые интерфейсы

**TPaymentType** - типизация способов оплаты

```
export type TPaymentType = 
  'онлайн' | 
  'при получении'
```

**FormErrors** - типизация валидации форм

```
export type FormErrors = Partial<Record<keyof IOrder, string>>;
```

**IProduct** - описание карточки продукта

```
export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}
```

**IOrder** - интерфейс формы заказа

```
export interface IOrder {
  paymentMethod: TPaymentType;
  email: string;
  phoneNumber: string;
	address: string;
	totalPayment: number;
	ProductsList: string[];
}
```

**IOrderResult** - описание ответа сервера на успешный заказ

```
export interface IOrderResult {
	id: string;
	totalPayment: number;
}
```

**IOrderAddress** - интерфейс формы оплаты и доставки

```
export interface IOrderAddress {
	paymentMethod: TPaymentType;
	address: string;
}
```

**IOrderContacts** - интерфейс контактной информации

```
export interface IOrderContacts {
	email: string;
	phone: string;
}
```

**IBasket** - интерфейс карточек в корзине

```
export interface IBasket {
	title: string;
	totalPrice: number;
}
```

**IAppStateModel** - интерфейс состояния веб-приложения

```
export interface IAppStateModel {
	productsList: IProduct[];
	basket: string[];
	order: IOrder | null;
}
```

**IFormActions** - обработчик событий мыши

```
export interface IFormActions {
	onClick: (event: MouseEvent) => void;
}
```