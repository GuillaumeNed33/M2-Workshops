/* eslint-disable no-undef */
inMemoryWorkshop = []


function getWorkshopList() {
    return new Promise((resolve, ) => {
        resolve(inMemoryWorkshop)
    })
}

function getWorkshopByName(name) {
    return new Promise((resolve, reject) => {
        if (!name) {
            reject(new Error('name parameter is required'))
        }
        const workshop = inMemoryWorkshop.find(workshop => workshop.name === name);
        if(typeof workshop !== 'undefined') {
            resolve(workshop)
        } else {
            resolve()
        }
    })
}

function addWorkshop(name, description) {
    return new Promise((resolve, reject) => {
        if (!name) {
            reject(new Error('Workshop name required'))
        }
        if (!description) {
            reject(new Error('Workshop description required'))
        }
        inMemoryWorkshop.push({
            name,
            description
        })
        resolve()
    })
}

function removeWorkshopByName(name) {
    return new Promise((resolve, reject) => {
        const index = inMemoryWorkshop.findIndex(workshop => workshop.name === name);
        if(index !== -1) {
            inMemoryWorkshop.splice(index,1)
            resolve()
        } else {
            return new Promise((resolve, reject) => {
                reject(new Error('Initial Workshop not found'))
            })
        }
    })
}

async function updateWorkshop(initialName, name, desc) {
    const index = inMemoryWorkshop.findIndex(workshop => workshop.name === initialName);
    if(index !== -1) {
        await removeWorkshopByName(initialName)
        return addWorkshop(name, desc)
    } else {
        return new Promise((resolve, reject) => {
            reject(new Error('Initial Workshop not found'))
        })
    }
}

module.exports = {
    getWorkshopList,
    getWorkshopByName,
    addWorkshop,
    removeWorkshopByName,
    updateWorkshop
}
