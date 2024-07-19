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

**TPaymentType** - типизация способов оплаты

```
type TPaymentType = 
  'онлайн' | 
  'при получении'
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
	basket: IBasket;
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

**IBasket** - интерфейс карточек в корзине

```
interface IBasket {
	title: string;
	totalPrice: number;
}
```

**IAppStateModel** - интерфейс состояния веб-приложения

```
interface IAppStateModel {
	productsList: IProduct[];
	basket: IBasket;
	order: IOrder | null;
}
```

**IFormActions** - обработчик событий мыши

```
interface IFormActions {
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

#### Класс AppStateModel 
- Модель состояния приложения. Наследует Model.
- **Конструктор** - `constructor(data: Partial, events: IEvents)`
- **Свойства**
	- `basket: Basket[]` - Список товаров в корзине.
	- `catalog: Product[]` - Каталог товаров.
	- `order: IOrder | null` - Данные заказа.
	- `formErrors: { [key: string]: string }` - Ошибки в формах.
- **Методы**
	- `addProduct(product: Product)` - Добавляет товар в корзину.
	- `deleteProduct(id: string)` - Удаляет товар из корзины по id.
	- `resetOrder()` - Сбрасывает данные заказа.
	- `resetBasket()` - Очищает корзину и сбрасывает заказ.
	- `getTotalOrder()` - Вычисляет общую стоимость заказа.
	- `setCatalog(products: IProduct[])` - Устанавливает каталог товаров.
	- `getOrderedProducts()` - Возвращает список заказанных товаров.
	- `productOrdered(product: Product): boolean` - Проверяет, заказан ли товар.
	- `setOrder()` - Обновляет данные заказа (общая стоимость, список товаров).
	- `validateOrder()` - Проверяет валидность формы заказа и обновляет formErrors.
	- `setPaymentMethod(paymentMethod: TPaymentType)` - Устанавливает способ оплаты.
	- `validateContacts()` - Проверяет валидность формы контактов и обновляет formErrors.
	- `setContactsField(field: string, value: string)` - Устанавливает значение поля в форме контактов.
	- `setAddress(address: string)` - Устанавливает адрес доставки.
### Слой View

#### Абстрактный Класс Component

- Базовый класс для создания элементов, отвечающих за визуальное представления интерфейса приложения, в том числе контейнеров, содержащих данные элементы.
- **Конструктор** - `constructor(container: HTMLElement)` - Принимает `HTML-элемент`, в который будет помещен компонент.
- **Методы**
	- `toggleClass(element: HTMLElement, className: string, force?: - boolean)` - Переключает класс `className` для элемента element.
  - `setText(element: HTMLElement, text: any)` - Устанавливает текстовое содержимое элемента.
	- `setDisabled(element: HTMLElement, disabled: boolean)` - Устанавливает или снимает атрибут `disabled` для элемента.
	- `setHidden(element: HTMLElement)` - Скрывает элемент.
	- `setVisible(element: HTMLElement)` - Отображает элемент.
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
	- `setCounter(count: number)` - Устанавливает значение счетчика товаров в корзине.
	- `setCatalog(cards: HTMLElement[])` - Отображает карточки товаров в каталоге.
	- `setLocked(locked: boolean)` - Блокирует прокрутку страницы, если locked равно true.

#### Класс Card

- Наследуется от абстрактного класса Component<ICard>.
- Используется для отображения данных о товаре и установки основных свойств карточки товара.
- **Конструктор** - `constructor(blockName: string, container: HTMLElement, events: ICardActions)` - Создает карточку товара.
	- `blockName` - Название класса для стилей карточки.
	- `container` - HTML-элемент для размещения карточки.
	- `events` - Объект с обработчиками действий карточки.
- **Свойства**
	- `title: HTMLElement` - Элемент заголовка карточки.
  - `image: HTMLImageElement` - Элемент изображения..
  - `description: HTMLElement` - Элемент описания.
  - `button: HTMLElement` - Элемент кнопки.
	- `price: HTMLElement` - Элемент цены.
  - `category: HTMLElement` - Элемент категории.
- **Методы**
	- `setTitle(title: string)` - Устанавливает заголовок карточки.
	- `setImage(src: string)` - Устанавливает изображение карточки.
	- `setDescription(text: string)` - Устанавливает описание карточки.
	- `setButtonText(text: string)` - Устанавливает текст кнопки.
	- `getPrice(): number` - Возвращает цену товара.
	- `setPrice(price: number)` - Устанавливает цену товара.
	- `setCategory(category: string)` - Устанавливает категорию товара и добавляет соответствующий класс.

#### Класс Basket

- Наследуется от абстрактного класса Component<IBasket>.
- Используется для представления корзины приложения.
- **Конструктор** - `constructor(container: HTMLElement, events: EventEmitter)` - создает HTML-элемент, в который будет встроен компонент корзины.
	- `events` - экземпляр `EventEmitter`, используемый для обработки событий.
- **Свойства**
	- `list: HTMLElement` - Список товаров в корзине.
	- `total: HTMLElement` - Элемент общей стоимости.
	- `button: HTMLButtonElement` - Кнопка оформления заказа
	- `items: HTMLElement[]` - Список карточек товаров в корзине.
- **Методы**
	- `toggleButton(disabled: boolean)` - Активирует/деактивирует кнопку оформления заказа.
	- `setItems(items: HTMLElement[])` - Отображает карточки товаров в корзине.
	- `setTotal(total: number)` - Устанавливает общую стоимость товаров.

#### Класс BasketCard

- Наследуется от класса Card.
- Используется для представления карточки товара в магазине
- **Конструктор** - `constructor(idx: number, container: HTMLElement, events: ICardActions)` -  Создает карточку товара для корзины.
	- `idx` - Номер карточки в списке корзины. 
	- `container` - HTML-элемент для размещения карточки. 
	- `events` - Объект с обработчиками действий карточки.
- **Свойства**
	- `index: HTMLElement` - Номер товара в корзине.
	- `title: HTMLElement` - Название товара.
	- `button: HTMLButtonElement` - Кнопка удаления.
	- `price: HTMLElement` - Цена товара.
- **Методы**
	- `setTitle(title: string)` - Устанавливает название товара.
	- `setPrice(price: number)` - Устанавливает цену товара.
	- `setIndex(index: number)` - Устанавливает номер товара в корзине.

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
	- `setContent(content: HTMLElement | null)` - Устанавливает содержимое окна.
	- `open()` - Открывает модальное окно.
	- `close()` - Закрывает модальное окно.
	- `render(data: { content: HTMLElement }): HTMLElement` - Отрисовывает окно с содержимым и возвращает корневой `DOM-элемент`.

#### Класс Form

- Наследуется от абстрактного класса Component<IForm>.
- Используется для описания базовой формы отправки данных.
- **Конструктор** - `constructor(container: HTMLFormElement, events: IEvents)` 
	- `container` - HTML-элемент модального окна.
	- `events` - экземпляр IEvents, используемый для обработки событий.
- **Свойства**
	- `submit: HTMLButtonElement` - Кнопка отправки формы.
	- `errors: HTMLElement` - Контейнер для сообщений об ошибках.
- **Методы**
	- `onInputChange(name: string, value: string)` - Обрабатывает изменение значения поля формы.
	- `setValid(valid: boolean)` - Устанавливает доступность кнопки отправки в зависимости от валидности формы.
	- `setErrors(errors: string)` - Отображает сообщения об ошибках.
	- `render(data: { valid?: boolean, errors?: string, [key: string]: any }): HTMLFormElement` - Отрисовывает форму с данными и возвращает корневой `DOM-элемент`.

#### Класс OrderAddress

- Наследуется от класса Form.
- Форма оплаты и доставки.
- **Конструктор** - `constructor(container: HTMLFormElement, events: IEvents)`
- **Методы**
	- `setButtonClass(name: string)` - Устанавливает класс `button_alt-active` для выбранной кнопки оплаты.
	- `setAddress(address: string)` - Устанавливает значение поля адреса.

#### Класс OrderContacts

- Наследуется от класса Form.
- Форма контактной информации:
- **Конструктор** - `constructor(container: HTMLFormElement, events: IEvents)`
- **Свойства** 
	- `phoneInput: HTMLInputElement` - Поле ввода телефона. 
	- `emailInput: HTMLInputElement` - Поле ввода email. 
- **Методы**
	`setPhone(phone: string)` - Устанавливает значение поля телефона.
	`setEmail(email: string)` - Устанавливает значение поля email.

#### Класс Success

- Наследуется от абстрактного класса Component<ISuccess>.
- Используется для отображения основной информации по завершенному заказу.
- **Конструктор** - `constructor(container: HTMLElement, total: number, actions: ISuccessActions)` - создает сообщение об успешном заказе с информацией о списанной сумме и кнопкой для закрытия. Функция, обрабатывающая клик на кнопку, передается через объект actions.
- **Свойства** 
	- `total: HTMLElement` -  Элемент с общей суммой заказа.
	- `close: HTMLElement` - Кнопка закрытия окна.
- **Методы** Наследуются от класса **Component**


### Слой Presenter

#### Файл index.ts

Файл index.ts является главным модулем, который устанавливает связь между представлением и данными, реагируя на события с помощью подписки на брокер событий (экземпляр класса EventEmitter).

- `products:changed` - изменение списка товаров, вызывает перерисовку каталога на странице.
- `order:submit` - открытие модального окна для заполнения контактной информации при отправке заказа.
- `formErrors:change` - изменение ошибок в форме заказа, обновление статуса валидации и ошибок для формы оплаты и контактов.
- `^contacts\..*:change` - изменение полей контактной информации, обновление данных о контактах в приложении.
- `^order\..*:change` - изменение адреса заказа, обновление соответствующего поля в приложении.
- `order:open` - открытие модального окна для ввода данных оплаты.
- `paymentMethod:changed` - выбор метода оплаты, обновление класса кнопки выбора оплаты и метода оплаты в приложении.
- `contacts:submit` - отправка контактной информации, обработка данных заказа и отправка на сервер.
- `card:selected` - выбор карточки товара, устанавливается превью товара.
- `preview:changed` - изменение превью товара, отображение модального окна с информацией о товаре.
- `card:addedToBasket` - добавление товара в корзину, закрытие модального окна.
- `card:removeFromBasket` - удаление товара из корзины, обновление содержимого модального окна корзины.
- `basket:open` - открытие модального окна с содержимым корзины.
- `basket:changed` - изменение списка товаров в корзине, обновление количества товаров на странице.
- `modal:open` - блокировка интерфейса страницы при открытии модального окна.
- `modal:close` - разблокировка интерфейса страницы при закрытии модального окна.

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

#### Класс LarekApi

- Класс осуществляет связь между приложением Разработчика и серверным приложением.
- Наследуется от класса Api.
- **Конструктор** - `constructor(cdn: string, baseUrl: string, options?: RequestInit)` - создает новый экземпляр класса LarekAPI, который наследует от класса Api и предназначен для взаимодействия с API магазина Larek.
- **Методы**
  - `getProductsList: () => Promise<IProduct[]>` - получает информацию по всем доступным товарам
  - `getProduct: (id: string) => Promise` - получает информацию по конкретному товару
  - `orderProducts: (order: IOrder) => Promise` - оформление заказа через соответствующий запрос на сервер
