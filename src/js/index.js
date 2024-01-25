let tasks = [
    {
        id: '1138465078061',
        completed: false,
        text: 'Посмотреть новый урок по JavaScript',
    },
    {
        id: '1138465078062',
        completed: false,
        text: 'Выполнить тест после урока',
    },
    {
        id: '1138465078063',
        completed: false,
        text: 'Выполнить ДЗ после урока',
    },
];
const taskList = document.querySelector('.tasks-list');
const formCreateTask = document.querySelector('.create-task-block');

document.addEventListener('keydown', changingDesign);
formCreateTask.addEventListener('submit', createNewTask);
taskList.addEventListener('click', event => {
    const deleteButton = event.target.closest("button")
    if(deleteButton)
    {
        createNewModalWindow(event);
    }
});

tasks.forEach((element) => {
    writeDisplayNewTask(element)
});

//Функция нажатия кнопки удаления задачи
function deleteButtonClick(event)
{
    const buttonDelete = event.target.closest("button['.delete-button']");
    if(buttonDelete)
    {
        createNewModalWindow();
    }
}

//Функция добавления новой задачи
function createNewTask(event)
{
    event.preventDefault();
    const taskAdd = event.target.taskName.value;
    if(!(taskAdd.length === 0))
    {
        if(checkingUniquenessName(taskAdd))
        {
            const obj = {};
            obj.id = getId();
            obj.completed = false;
            obj.text = taskAdd;
            tasks.push(obj);
            writeDisplayNewTask(obj);
            deleteDisplayError();
        }
        else
        {
            writeDisplayNewError('Задача с таким названием уже существует.');
        }
    }
    else
    {
        writeDisplayNewError('Название задачи не должно быть пустым');
    }
}

//функция проверки уникальности названия
function checkingUniquenessName(name)
{
    for(let obj of tasks)
    {
        if(obj.text.toLowerCase() === name.toLowerCase())
        {
            return false;
        }
    }
    return true;
}

//Функция получения уникального Id
function getId()
{
    let randNumber = Math.random() * Number(9999999999999);
    for(let obj of tasks)
    {
        if(randNumber === obj.id)
        {
            randNumber = getId();
            break;
        }
    }
    return randNumber;
}

//Функция отрисовки новой задачи
function writeDisplayNewTask(obj)
{
    //Создаём форму
    const form = document.createElement('form');
    form.className = 'checkbox-form';

    //Создаём чекбоксы
    const inputCheckBox = document.createElement('input');
    inputCheckBox.className = 'checkbox-form__checkbox';
    inputCheckBox.type = 'checkbox';
    inputCheckBox.id =obj.id;

    //Создаём лейблы
    const labelTask = document.createElement('label');
    labelTask.htmlFor = obj.id;

    //Добавляем в форму чекбоксы и лейблы
    form.append(inputCheckBox);
    form.append(labelTask);

    //Создаём спан
    const spanContent = document.createElement('span');
    spanContent.className = 'task-item__text';
    spanContent.innerText = `${obj.text}`;

    //Создаём контейнер(main-content)
    const divMainContent = document.createElement('div');
    divMainContent.className = 'task-item__main-content';

    //Добавляем в контейнер(main-content) форму и спан
    divMainContent.append(form);
    divMainContent.append(spanContent);

    //Создаём кнопку удаления
    const buttonDelete = document.createElement('button');
    buttonDelete.classList.add('task-item__delete-button');
    buttonDelete.classList.add('default-button');
    buttonDelete.classList.add('delete-button');
    buttonDelete.innerText = 'Удалить';

    //Создаём контейнер(main-container)
    const divMainContainer = document.createElement('div');
    divMainContainer.className = 'task-item__main-container';

    //Добавляем в контейне(main-container) контейнер(main-content) и кнопку удаления
    divMainContainer.append(divMainContent);
    divMainContainer.append(buttonDelete);

    //Создаём контейнер(task-item)
    const divTaskItem = document.createElement('div');
    divTaskItem.className = 'task-item';
    divTaskItem.dataset.taskId = obj.id;

    //Добавляем в контейнер(task-item) контейнер(main-container)
    divTaskItem.append(divMainContainer);

    //Добавляем в контейнер(task-list) контейнер(task-item)
    taskList.append(divTaskItem);
}

//Функция отрисовки ошибки
function writeDisplayNewError(ErrorMessage)
{
    deleteDisplayError()
    const span = document.createElement('span');
    span.className = 'error-message-block';
    span.innerText = ErrorMessage;

    formCreateTask.append(span);
}

//Функция удалени ошибки
function deleteDisplayError()
{
    const error = document.querySelector('.error-message-block');
    if(error != null)
    {
        error.remove();
    }
}

//Функция создания модального окна
function createNewModalWindow(event)
{
    const divTaskItem = event.target.closest("div[class='task-item']");
    const dataId = divTaskItem.dataset.taskId;

    const modalOverlay = document.querySelector("div[class='modal-overlay']");
    if(modalOverlay)
    {
        modalOverlay.classList.remove('modal-overlay_hidden')
    }
    else
    {
        const h3ModalQuestion = document.createElement('h3');
        h3ModalQuestion.className = 'delete-model_question';
        h3ModalQuestion.innerText = 'Вы действительно хотите удалить эту задачу?';

        const buttonCancel = document.createElement('button');
        buttonCancel.classList.add('delete-modal__button');
        buttonCancel.classList.add('delete-modal__cancel-button');
        buttonCancel.innerText = 'Отмена';
        buttonCancel.addEventListener('click', modalOverlayHidden);

        const buttonDelete = document.createElement('button');
        buttonDelete.classList.add('delete-modal__button');
        buttonDelete.classList.add('delete-modal__confirm-button');
        buttonDelete.innerText = 'Удалить';
        buttonDelete.addEventListener('click', event => {
            for(let obj of tasks)
            {
                if(obj.id === dataId)
                {
                    const index = tasks.indexOf(obj);
                    tasks.splice(index, 1);
                }
            }
            divTaskItem.remove();
            modalOverlayHidden();
        });

        const divDeleteModalButtons = document.createElement('div');
        divDeleteModalButtons.className = 'delete-modal__buttons';

        divDeleteModalButtons.append(buttonCancel);
        divDeleteModalButtons.append(buttonDelete);

        const divDeleteModal = document.createElement('div');
        divDeleteModal.className = 'delete-modal';

        divDeleteModal.append(h3ModalQuestion);
        divDeleteModal.append(divDeleteModalButtons);

        const divModalOverlay = document.createElement('div');
        divModalOverlay.classList.add('modal-overlay');

        divModalOverlay.append(divDeleteModal);

        const body = document.querySelector('body');
        if(body)
        {
            body.append(divModalOverlay);
        }
    }
}

//Функция скрытия окна оверлея
function modalOverlayHidden()
{
    const overlay = document.querySelector("div[class ='modal-overlay']");
    if(overlay)
    {
        overlay.classList.add('modal-overlay_hidden');
    }
}

//Функция смены темы
function changingDesign(event)
{
    if(event.keyCode === 9)
    {
        event.preventDefault()
        const body = document.querySelector('body');
        const taskItems = document.getElementsByClassName('task-item');
        const buttons = document.getElementsByClassName('default-button');

        if(body.style.background === '#24292E' || body.style.background === 'rgb(36, 41, 46)')
        {
            console.log('Смена на светлую тему')
            body.style.background = 'initial';
            for(let taskItem of taskItems)
            {
                taskItem.style.color = 'initial';
            }
            for(let button of buttons)
            {
                button.style.border = 'none';
            }
        }
        else
        {
            console.log('Cмена на темную тему')
            body.style.background = '#24292E';
            for(let taskItem of taskItems)
            {
                taskItem.style.color = '#ffffff';
            }
            for(let button of buttons)
            {
                button.style.border = '1px solid #ffffff';
            }
        }
    }
}