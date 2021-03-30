const db = require('../data/config');

function getClasses(){
    return db('classes').select('*');
}

function getClassById(id){
    return db('classes').where('id', id).first();
}

function getClassBy(filter){
    return db('classes').where(filter).first();
}

async function updateClass(changes, id){
    await db('classes').where('id', id).update(changes);
    return getClassById(id);
}

function removeClass(id){
    return db('classes').where('id', id).del();
}

async function addClass(add){
    const [id] = await db('classes').insert(add);
    return getClassById(id)
}

module.exports = {
    getClassBy,
    getClasses,
    getClassById,
    updateClass,
    removeClass,
    addClass
}