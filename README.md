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

## Архитектура проекта и взаимодействие между слоями

### Проект следует архитектурному паттерну Model-View-Presenter (MVP), разделяя приложение на три основных слоя:

1. Модель (Model): Модель представляет собой бизнес-логику приложения и данные. Она ответственна за выполнение операций, таких как чтение и запись данных, обработка бизнес-логики и взаимодействие с базой данных или внешними источниками данных. Модель не зависит от представления или презентера и предоставляет API для доступа к данным.
2. Представление (View): Представление отображает данные пользователю и обрабатывает пользовательский ввод. Оно представляет собой интерфейс пользователя, через который пользователь взаимодействует с приложением. В MVP представление пассивно и не содержит бизнес-логики. Оно лишь отображает данные, предоставленные презентером, и передает пользовательский ввод презентеру.
3. Презентер (Presenter): Презентер является посредником между моделью и представлением. Он содержит бизнес-логику приложения и управляет взаимодействием между моделью и представлением. Презентер получает данные от модели, форматирует их и передает представлению для отображения. Он также обрабатывает пользовательский ввод, передавая соответствующие команды модели для обновления данных.

### Взаимодействие:

Компоненты взаимодействуют через события. Модель генерирует события при изменении данных, Presenter слушает эти события, обновляет модель и передает данные представлению, а представление обновляет пользовательский интерфейс и отправляет события Presenter в ответ на действия пользователя.

## Используемые интерфейсы

**ILarekItem** - основные параметры товара.

```
interface ILarekItem {
	category: string;
	price: number | null;
}
```

**IProductItem** - описательны свойства товара.

```
interface IProductItem {
	id: string;
	title: string;
	description?: string;
	image: string;
}
```

**IProduct** - все параметры товара.

```
type IProduct = IProductItem & ILarekItem;
```

**IAddressForm** - форма адреса и спосба оплаты.

```
interface IAddressForm {
	payment: string;
	address: string;
}
```

**IContactsForm** - форма контактов.

```
interface IContactsForm {
	email: string;
	phone: string;
}
```

**IOrder** - полная информация о заказе.

```
interface IOrder extends IAddressForm, IContactsForm {
	items: string[];
	total: number;
}
```

**IOrderResult** - итоговые данные заказа.

```
interface IOrderResult {
	id: string;
	total: number;
}
```

**FormErrors** - типизация валидации форм

```
type FormErrors = Partial<Record<keyof IOrder, string>>;
```

**IProduct** - описание карточки продукта

```
interface IProduct {
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
interface IOrder {
  paymentMethod: TPaymentType;
  email: string;
  phoneNumber: string;
	address: string;
	items: string[];
	total: number;
}
```

**IOrderResult** - описание ответа сервера на успешный заказ

```
interface IOrderResult {
	id: string;
	totalPayment: number;
}
```

**IOrderAddress** - интерфейс формы оплаты и доставки

```
interface IOrderAddress {
	paymentMethod: TPaymentType;
	address: string;
}
```

**IOrderContacts** - интерфейс контактной информации

```
interface IOrderContacts {
	email: string;
	phone: string;
}
```

**IBasketCard** - интерфейс карточек в корзине

```
interface IBasketCard {
	title: string;
	price: number;
}
```

**IAppStateModel** - интерфейс состояния веб-приложения

```
interface IAppStateModel {
	productsList: IProduct[];
	basket: string[];
	order: IOrder | null;
}
```

**ICardActions** - обработчик событий мыши

```
interface ICardActions {
	onClick: (event: MouseEvent) => void;
}
```

### Слой Model

#### Абстрактный класс Model

- Абстрактный базовый класс, который используется для создания объекта хранения данных.
- **Конструктор** - `constructor(data: Partial, protected events: IEvents)`.
  - `data` - Частичные данные для инициализации модели.
	- `events` - Экземпляр `EventEmitter` для работы с событиями.
- **Методы**:
  - `emitChanges(event: string, payload?: object):` - Генерирует событие event с данными payload

#### Класс AppData 
- Модель состояния приложения. Наследует Model.
- **Конструктор** - `constructor(data: Partial, events: IEvents)`
- **Свойства**
	- `basket: ICard[]` - Список товаров в корзине.
	- `catalog: ICard[]` - Каталог товаров.
	- `preview: string` - состояние preview карточки товара.
	- `order: IOrder | null` - Данные заказа.
	- `errors: FormErrors` - Ошибки в формах.
- **Методы**
	- `setCatalog(items: ICard[])` - Устанавливает каталог товаров.
	- `getOrderedProducts()` - Возвращает список заказанных товаров.
	- `checkOrderedProduct(item: ICard)` - проверяет карточку товара в корзине.
	- `setPreview(item: ICard)` - устанавливает preview на карточку товара.
	- `addToBasket(item: ICard)` - добавляет товар в корзину.
	- `deleteFromBasket(id: string)` - удаляет товар из корзины.
	- `getBasket ()` - возвращает корзину.
	- `getSum()` - возвращает итоговую сумму товаров.
	- `validateAddressForm()` - валидация формы адреса и способа оплаты.
	- `validateContactsForm()` - валидация формы контактов.
	- `setAddressForm(field: keyof IAddressForm, value: any)` - установка значений в поля формы адреса и способа оплаты.
	- `setContactsForm(field: keyof IContactsForm, value: string)` - установка значений в поля формы контактов.
	- `clearBasket()` - очистка корзины.
	- `clearOrder()` - очистка заказа.
### Слой View

#### Абстрактный Класс Component

- Базовый класс для создания элементов, отвечающих за визуальное представления интерфейса приложения, в том числе контейнеров, содержащих данные элементы.
- **Конструктор** - `constructor(container: HTMLElement)` - Принимает `HTML-элемент`, в который будет помещен компонент.
- **Методы**
	- `toggleClass(element: HTMLElement, className: string, force?: boolean)` - Переключает класс `className` для элемента element.
	- `setVisible(element: HTMLElement)` - Отображает элемент.
	- `setHidden(element: HTMLElement)` - Скрывает элемент.
  - `setText(element: HTMLElement, text: unknown)` - Устанавливает текстовое содержимое элемента.
	- `setDisabled(element: HTMLElement, disabled: boolean)` - Устанавливает или снимает атрибут `disabled` для элемента.
	- `setImage(element: HTMLImageElement, src: string, alt?: string)` - Устанавливает атрибуты `src` и `alt` для изображения.
	- `render(data?: Partial)``: HTMLElement` - Отрисовывает компонент с предоставленными данными и возвращает корневой `DOM-элемент`.

#### Класс Page

- Наследуется от абстрактного класса Component.
- Используется для отрисовки главной страницы.
- **Конструктор** - `constructor(container: HTMLElement, protected events: IEvents)`
	- `container: HTMLElement` - `HTML-элемент`, который будет служить контейнером для страницы.
  - `events: IEvents` - объект для работы с событиями приложения.
- **Свойства**
	- `counter: HTMLElement` - Элемент счетчика товаров в корзине.
  - `catalog: HTMLElement` - Контейнер для каталога товаров.
  - `wrapper: HTMLElement` - Обертка страницы.
  - `basket: HTMLElement` - Элемент корзины.
- **Методы**
	- `set counter(count: number)` - Устанавливает значение счетчика товаров в корзине.
	- `set catalog(cards: HTMLElement[])` - Отображает карточки товаров в каталоге.
	- `set locked(locked: boolean)` - Блокирует прокрутку страницы, если locked равно true.

#### Класс Card

- Наследуется от абстрактного класса Component<ICard>.
- Используется для отображения данных о товаре и установки основных свойств карточки товара.
- **Конструктор** - `constructor(blockName: string, container: HTMLElement, actions: ICardActions)` - Создает карточку товара.
	- `blockName` - Название класса для стилей карточки.
	- `container` - HTML-элемент для размещения карточки.
	- `actions` - Объект с обработчиками событий карточки.
- **Свойства**
	- `title: HTMLElement` - Элемент заголовка карточки.
  - `description: HTMLElement` - Элемент описания.
	- `image: HTMLImageElement` - Элемент изображения.
	- `category: HTMLElement` - Элемент категории.
	- `price: HTMLElement` - Элемент цены.
	- `number: HTMLElement` - Элемент порядкового номера в корзине.
  - `button: HTMLElement` - Элемент кнопки.
- **Методы**
	- `set id(value: string)` - устанавливает id элемента.
	- `get id()` - возвращает id элемента.
	- `set title(value: string)` - устанавливает заголовок карточки.
	- `get title()` - возвращает заголовок карточки.
	- `set description(value: string | string[])` - устанавливает описание карточки.
	- `set image(value: string)` - устанавливает изображение карточки.
	- `set category(value: string)` - устанавливает категорию карточки.
	- `get category()` - возвращает категорию карточки.
	- `set price(value: number)` - устанавливает цену продукта.
	- `get price()` - возвращает цену продукта.
	- `set number(value: string)` - устанавливает порядковый номер в корзине.
	- `get number()` - возвращает порядковый номер в корзине.
	- `set button(value: string)` - устанавливает текст кнопки.

#### Класс Basket

- Наследуется от абстрактного класса Component<IBasket>.
- Используется для представления корзины приложения.
- **Конструктор** - `constructor(container: HTMLElement, events: EventEmitter)` - создает HTML-элемент, в который будет встроен компонент корзины.
	- `events` - экземпляр `EventEmitter`, используемый для обработки событий.
- **Свойства**
	- `list: HTMLElement` - Список товаров в корзине.
	- `total: HTMLElement` - Элемент общей стоимости.
	- `button: HTMLButtonElement` - Кнопка оформления заказа
- **Методы**
	- `set items(items: HTMLElement[])` - Отображает карточки товаров в корзине.
	- `set total(total: number)` - Устанавливает общую стоимость товаров.

#### Класс Modal

- Наследуется от абстрактного класса Component<IModal>.
- Содержит информацию отображения модального окна.
- **Конструктор** - `constructor(container: HTMLElement, events: IEvents) ` -  Создает карточку товара для корзины.
	- container - HTML-элемент модального окна.
	- events - экземпляр IEvents, используемый для обработки событий.
- **Свойства**
	- `closeButton: HTMLButtonElement` - Кнопка закрытия окна.
	- `content: HTMLElement` - Контейнер для содержимого окна.
- **Методы**
	- `set content(content: HTMLElement | null)` - Устанавливает содержимое окна.
	- `open()` - Открывает модальное окно.
	- `close()` - Закрывает модальное окно.
	- ` render(data: IModalData): HTMLElement` - Отрисовывает окно с содержимым и возвращает корневой `DOM-элемент`.

#### Класс Form

- Наследуется от абстрактного класса Component<IFormState>.
- Используется для описания базовой формы отправки данных.
- **Конструктор** - `constructor(container: HTMLFormElement, events: IEvents)` 
	- `container` - HTML-элемент модального окна.
	- `events` - экземпляр IEvents, используемый для обработки событий.
- **Свойства**
	- `submit: HTMLButtonElement` - Кнопка отправки формы.
	- `errors: HTMLElement` - Контейнер для сообщений об ошибках.
- **Методы**
	- `onInputChange(field: string, value: string)` - Обрабатывает изменение значения поля формы.
	- `set valid(value: boolean)` - Устанавливает доступность кнопки отправки в зависимости от валидности формы.
	- `set errors(errors: string)` - Отображает сообщения об ошибках.
	- `render(state: Partial<T> & IFormState)` - Отрисовывает форму с данными и возвращает корневой `DOM-элемент`.

#### Класс Address

- Наследуется от класса Form<IAddressForm>.
- Форма оплаты и доставки.
- **Конструктор** - `constructor(container: HTMLFormElement, events: IEvents)`
- **Методы**
	- `set payment(name : string)` - Устанавливает класс `button_alt-active` для выбранной кнопки оплаты.
	- `set address(value: string)` - Устанавливает значение поля адреса.

#### Класс Contacts

- Наследуется от класса Form<IContactsForm>.
- Форма контактной информации:
- **Конструктор** - `constructor(container: HTMLFormElement, events: IEvents)`
- **Методы**
	`set phone(value: string)` - Устанавливает значение поля телефона.
	`set email(value: string)` - Устанавливает значение поля email.

#### Класс Success

- Наследуется от абстрактного класса Component<ISuccess>.
- Используется для отображения основной информации по завершенному заказу.
- **Конструктор** - `constructor(container: HTMLElement, total: number, actions: ISuccessActions)` - создает сообщение об успешном заказе с информацией о списанной сумме и кнопкой для закрытия. Функция, обрабатывающая клик на кнопку, передается через объект actions.
- **Свойства** 
	- `total: HTMLElement` -  Элемент с общей суммой заказа.
	- `close: HTMLElement` - Кнопка закрытия окна.
- **Методы** Наследуются от класса **Component** + 
	- `set total(value: number)` - устанавливает итоговую сумму заказа.


### Слой Presenter

#### Файл index.ts

Файл index.ts является главным модулем, который устанавливает связь между представлением и данными, реагируя на события с помощью подписки на брокер событий (экземпляр класса EventEmitter).

- `items:changed` - изменение списка товаров, вызывает перерисовку каталога на странице.
- `card:select` - полготавливает карточку к событию `preview:changed`, при котором выбранная карточка товара открыватеся в виде модального окна.
- `preview:changed` - вывод карточки с главной страницы в виде модального окна.
- `product:delete` - удаление выбранного товара из корзины.
- `product:add` - добавление выбранного товара в корзину.
- `modal:open` - устанавливает состояние *locked = true*, которое фиксирует страницу на открытом модальном окне.
- `modal:close` - устанавливает состояние *locked = false*, которое разблокирует страницу на закрытии модального окна.
- `number:changed` - используется для подсчета количества товаров в корзине.
- `basket:open` - событие открытия корзтны с товарами.
- `basket:changed` - рендер изменений внутри корзины, таких как добавление карточки товара и изменение его порядкового номера.
- `address:open` - открытие модального окна с формой заполнения способа оплаты и адреса.
- `/^order\..*:change/` - запись изменений полей формы заполнения способа оплаты и адреса.
- `addressErrors:changed` - изменение ошибок в форме заказа, обновление статуса валидации и ошибок для формы адреса.
- `order:submit` - отправка формы адреса и способа оплаты, открытие формы контактов.
- `/^contacts\..*:change/` - запись изменений полей формы контактов.
- `contactsErrors:changed` - изменение ошибок в форме заказа, обновление статуса валидации и ошибок для формы контактов.
- `contacts:submit` - отправка формы заказа на сервер, открытие модального окна успешного заказа.

#### Класс EventEmitter

- Является вспомогательным инструментом для реализации событий(Events).
- **Конструктор** - `constructor() { this._events = new Map<EventName, Set>(); }` - Создает новый экземпляр класса EventEmitter, отвечающий за управление событиями в веб-приложении.
- **Методы**
	- `on<T extends object>(eventName: EventName, callback: (event: T) => void)` - устанавливает обработчики на события.
	- `off(eventName: EventName, callback: Subscriber)` - снимает обработчики с события.
	- `emit<T extends object>(eventName: string, data?: T)` - инициирует события с данными.
	- `onAll(callback: (event: EmitterEvent) => void)` - слушает все события.
	- `offAll()` - сбрасывает все обработчики
	- `trigger<T extends object>(eventName: string, context?: Partial<T>)` - делает колбек триггер,генерирующий событие при вызове 

#### Класс Api

- Осуществляет взаимодействие с сервером.
- Отправляет get и post запросы для получения и отправки данных.
- **Конструктор** - `constructor(baseUrl: string, options: RequestInit = {})` - создает новый экземпляр класса Api, который используется для выполнения HTTP-запросов к серверу.
- **Методы**
	- `get` - передача запроса методом `GET`;
	- `post` - передача запроса методом `POST`;
	- `handleResponse` - парсинг ответа сервера.

#### Класс WebLarekApi

- Класс осуществляет связь между приложением Разработчика и серверным приложением.
- Наследуется от класса Api.
- **Конструктор** - `constructor(cdn: string, baseUrl: string, options?: RequestInit)` - создает новый экземпляр класса LarekAPI, который наследует от класса Api и предназначен для взаимодействия с API магазина Larek.
- **Методы**
  - `getProductsList: () => Promise<IProduct[]>` - получает информацию по всем доступным товарам
  - `getProduct: (id: string) => Promise<IProduct>` - получает информацию по конкретному товару
  - `orderProducts: (order: IOrder) => Promise<IOrderResult>` - оформление заказа через соответствующий запрос на сервер
