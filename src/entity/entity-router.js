const express=require('express');
const path=require('path');
let entityService=require('./entity-service');
entityService=new entityService();
const router=express.Router();
const jsonBodyParser=express.json();

router.route('/:id').get(jsonBodyParser, async (req, res, next) => {
    const {id}=req.params;
    const db=req.app.get('db')
    if(!typeof id=='number') {
        return res.status(400).json({Error: 'Not found.'})
    }
    const data=await entityService.getEntityByIdForEngine(db, id);
    if(data) {
        if(data.Error) {
            return res.status(400).json(data)
        }
        else {
            res.status(200).json(data);
        }

    }


});

module.exports=router;
