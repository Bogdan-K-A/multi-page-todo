let todoArr = []

const createAppTitle = (title) => {
  const appTitle = document.createElement('h1')
  appTitle.innerHTML = title

  return appTitle
}

const createTodoForm = () => {
  const form = document.createElement('form')
  const input = document.createElement('input')
  const addButton = document.createElement('button')
  const wrapper = document.createElement('div')

  form.classList.add('input-group', 'mb-3')
  input.classList.add('form-control')
  input.placeholder = 'Ведите название дела'
  addButton.classList.add('btn', 'btn-primary')
  addButton.textContent = 'Добавить дело'
  wrapper.classList.add('input-group-append')

  wrapper.append(addButton)
  form.append(input, wrapper)

  return {
    form,
    input,
    addButton,
  }
}

const createTodoList = () => {
  const list = document.createElement('ul')
  list.classList.add('list-group')

  return list
}

const createTodoItem = (name) => {
  const todoItem = document.createElement('li')
  const btnWrapper = document.createElement('div')
  const doneBtn = document.createElement('button')
  const deleteBtn = document.createElement('button')

  const randomId = Math.random() * 15.75
  todoItem.id = randomId.toFixed(2)

  todoItem.classList.add(
    'list-group-item',
    'd-flex',
    'justify-content-between',
    'align-items-center',
  )
  doneBtn.classList.add('btn', 'btn-success')
  deleteBtn.classList.add('btn', 'btn-danger')

  todoItem.textContent = name
  doneBtn.textContent = 'Готово'
  deleteBtn.textContent = 'Удалить'

  btnWrapper.append(doneBtn, deleteBtn)
  todoItem.append(btnWrapper)

  return {
    todoItem,
    doneBtn,
    deleteBtn,
    btnWrapper,
  }
}

const changeItemDone = (arr, item) => {
  arr.map((obj) => {
    if ((obj.id === item.id) & (obj.done === false)) {
      obj.done = true
    } else if ((obj.id === item.id) & (obj.done === true)) {
      obj.done = false
    }
  })
}

const completeTodoItem = (item, btn) => {
  btn.addEventListener('click', () => {
    todoArr = JSON.parse(localStorage.getItem(key))
    item.classList.toggle('list-group-item-success')
    changeItemDone(todoArr, item)

    localStorage.setItem(key, JSON.stringify(todoArr))
  })
}

const deleteTodoItem = (item, btn) => {
  btn.addEventListener('click', () => {
    if (confirm('Вы уверены')) {
      todoArr = JSON.parse(localStorage.getItem(key))

      const newList = todoArr.filter((obj) => obj.id !== item.id)

      localStorage.setItem(key, JSON.stringify(newList))
      item.remove()
    }
  })
}

function createTodoApp(container, title, key) {
  const appTitle = createAppTitle(title)
  const appForm = createTodoForm()
  const appList = createTodoList()

  container.append(appTitle, appForm.form, appList)

  if (localStorage.getItem(key)) {
    todoArr = JSON.parse(localStorage.getItem(key))

    for (const obj of todoArr) {
      const todoItem = createTodoItem(appForm.input.value)

      todoItem.todoItem.textContent = obj.name
      todoItem.todoItem.id = obj.id

      if (obj.done === true) {
        todoItem.todoItem.classList.add('list-group-item-success')
      } else {
        todoItem.todoItem.classList.remove('list-group-item-success')
      }

      completeTodoItem(todoItem.todoItem, todoItem.doneBtn)
      deleteTodoItem(todoItem.todoItem, todoItem.deleteBtn)

      appList.append(todoItem.todoItem)
      todoItem.todoItem.append(todoItem.btnWrapper)
    }
  }

  appForm.form.addEventListener('submit', (e) => {
    e.preventDefault()

    const todoItem = createTodoItem(appForm.input.value)

    if (!appForm.input.value) return

    completeTodoItem(todoItem.todoItem, todoItem.doneBtn)
    deleteTodoItem(todoItem.todoItem, todoItem.deleteBtn)

    let localStorageData = localStorage.getItem(key)

    if (localStorageData === null) {
      todoArr = []
    } else {
      todoArr = JSON.parse(localStorageData)
    }

    const createItemObj = (arr) => {
      const itemObj = {}
      itemObj.name = appForm.input.value
      itemObj.id = todoItem.todoItem.id
      itemObj.done = false

      arr.push(itemObj)
    }

    createItemObj(todoArr)
    localStorage.setItem(key, JSON.stringify(todoArr))

    appList.append(todoItem.todoItem)
    appForm.input.value = ''
  })
}

const mainContainer = document.querySelector('.container')
const key = mainContainer.getAttribute('id')
const currentPage = mainContainer.children[0].innerHTML

createTodoApp(mainContainer, `Список-${currentPage}`, `${key}`)
