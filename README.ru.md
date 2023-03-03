```puml
skinparam monochrome true
skinparam shadowing false
left to right direction

Пользователь --> (Принятие решения на основе моделирования)
(Принятие решения на основе моделирования) ..> (Просмотр свойств модели и акторов) : <<include>>
(Просмотр графических отчетов на основе свойств) ..> (Просмотр свойств модели и акторов) : <<extend>>

(Конфигурирование модели) ..> (Принятие решения на основе моделирования) : <<extend>>
(Конфигурирование модели) ..> (Добавление сборок) : <<include>>
(Конфигурирование модели) ..> (Выбор модулей, участвующих в моделировании) : <<include>>
(Конфигурирование модели) ..> (Управление жизненным циклом моделирования) : <<include>>
(Конфигурирование модели) ..> (Изменение свойст модели и акторов) : <<include>>
```

## Отображение карты и акторов

Диаграмма последовательности для компонента обозревателя карты

```mermaid
sequenceDiagram
    participant Backend as Платформа моделирования
    participant BrowserComponent as Компонент обозревателя карты
    participant Map as Карта

    loop Добавление метаданных
        Backend -) BrowserComponent: Метаданные объекта карты<br/>(MapFeaturesMetadata)
        activate BrowserComponent

        BrowserComponent -) Map: Слой с заданным стилем<br/>(open_layers_style)

        deactivate BrowserComponent
    end

    loop Добавление объектов карты
        Backend -) BrowserComponent: Объект карты<br/>(MapFeature)
        activate BrowserComponent

        BrowserComponent -> BrowserComponent: Сопоставление объекта карты с метаданными (слоем)
        BrowserComponent -) Map: Геометрия актора (geo_json)

        deactivate BrowserComponent
    end
    
    loop Удаление объектов карты
        Backend -) BrowserComponent: Событие удаления объекта карты<br/>(RemoveMapFeatureEvent)
        activate BrowserComponent

        BrowserComponent -> BrowserComponent: Сопоставление идентификаторов (id)
        BrowserComponent -) Map: Запрос на удаление геометрии актора

        deactivate BrowserComponent
    end
```

## Работа со свойствами объектов карты

Диаграмма последовательности для компонента свойств карты

```mermaid
sequenceDiagram
    participant Backend as Платформа моделирования
    participant PropertiesComponent as Компонент построения отчетов
    participant Properties as Таблицы свойств

    loop Добавление метаданных
        Backend -) PropertiesComponent: Метаданные объекта карты<br/>(MapFeaturesMetadata)
        activate PropertiesComponent

        PropertiesComponent -) Properties: Пустые таблицы с известными<br/>названиями и типами колонок

        deactivate PropertiesComponent
    end

    loop Добавление значений обозреваемых свойств
        Backend -) PropertiesComponent: Значение обозреваемого свойства объекта карты<br/>(MapFeatureObservableProperty)
        activate PropertiesComponent

        PropertiesComponent -> PropertiesComponent: Сопоставление обозреваемого свойства с метаданными
        PropertiesComponent -) Properties: Значение для конкретной колонки и ячейки

        deactivate PropertiesComponent
    end
    
    loop Изменение значений обозреваемых свойств
        Properties -) PropertiesComponent: Изменение значения в ячейке
        activate PropertiesComponent
        PropertiesComponent -) Backend: Значение обозреваемого свойства объекта карты<br/>(MapFeatureObservableProperty)
        activate Backend

        deactivate PropertiesComponent
        Backend -> Backend: Обновление значения свойства

        deactivate Backend
    end
    
    loop Удаление объектов карты
        Backend -) PropertiesComponent: Событие удаления объекта карты<br/>(RemoveMapFeatureEvent)
        activate PropertiesComponent
        
        PropertiesComponent -> PropertiesComponent: Сопоставление идентификаторов (id)
        PropertiesComponent -) Properties: Запрос на удаление строки таблицы

        deactivate PropertiesComponent
    end
```

## Построение отчетов

Диаграмма последовательности для компонента построения отчетов

```mermaid
sequenceDiagram
    participant Backend as Платформа моделирования
    participant ReportComponent as Компонент построения отчетов
    participant Report as Отчет

    loop Добавление метаданных
        Backend -) ReportComponent: Метаданные объекта карты<br/>(MapFeaturesMetadata)
        activate ReportComponent

        ReportComponent -) Report: Пустые диаграммы с координатными<br/>осями для каждого свойства

        deactivate ReportComponent
    end

    loop Добавление значений обозреваемых свойств
        Backend -) ReportComponent: Значение обозреваемого свойства объекта карты<br/>(MapFeatureObservableProperty)
        activate ReportComponent

        ReportComponent -> ReportComponent: Сопоставление обозреваемого свойства с метаданными
        ReportComponent -) Report: Значение для конкретной диаграммы

        deactivate ReportComponent
    end
```
