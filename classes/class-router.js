const express = require('express');
const Classes = require('./class-model');
const restrict = require("../users/user-middleware");

const router = express.Router();

router.get('/', async (req, res, next) => {
    try{
        return res.status(200).json(await Classes.getClasses());
    } catch(error){
        next(error)
    }
})

router.get('/:id', async (req, res, next) => {
    try{
        const getClass = await Classes.getClassById(req.params.id);
        if(!getClass){
            return res.status(400).json({
                message: "Invalid ID"
            })
        }

        return res.status(200).json(getClass);
    } catch(error){
        next(error)
    }
})

router.put('/:id', restrict("instructor"), async (req, res, next) => {
    try{
       const updateClass = await Classes.updateClass(req.body, req.params.id);
       if(!updateClass){
           return res.status(400).json({
               message: "invalid ID"
           })
       }
       return res.status(200).json(updateClass);
    } catch(error){
        next(error);
    }
})

router.delete('/:id', restrict("instructor"), async (req, res, next) => {
    try{
        await Classes.removeClass(req.params.id);
        return res.status(204).json({
            message: "Deleted"
        })
    } catch(error){
        next(error)
    }
})

router.post('/', restrict("instructor"), async (req, res, next) => {
    try{
        const newClass = await Classes.addClass(req.body);
        if(!newClass.name){
            return res.status(400).json({
                message: "Please input the name of the class"
            })
        }
        return res.status(201).json(newClass)
    } catch(error){
        next(error)
    }
})

module.exports = router;