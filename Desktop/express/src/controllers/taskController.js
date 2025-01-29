const HttpStatusCode = require('../utils/httpStatusCode.js');
const Task = require('../models/taskModel.js');
const AppError = require('../utils/appError.js');
const catchAsync =require('../utils/catchAsync.js');

const tasks = [
    {
        id: 1,
        text: 'Doctor appointment',
        day: ' Feb 5th at 2;30pm',
        reminder: true
    },
    {
        id: 2,
        text: 'Meeting at School',
        day: ' Feb 6th at 1;30pm',
        reminder: true
    },
    {
        id: 3,
        text: 'Food Shopping',
        day: ' Feb 5th at 2;30pm',
        reminder: false
    }
]


const getAllTasks = catchAsync (async(req, res, next) => {
    const query = Task.find({});
        const allTasks = await query.select('-__v');
        res.status(HttpStatusCode.OK).json({
            status: 'success',
            results: allTasks.length,
            data:{
                tasks: allTasks
            }
        }) 
    
})

const getTask = catchAsync (async(req, res, next)=> {
    const taskId = req.params.id;
    const query = Task.findById(taskId);
    const task = await query.select('-__v');

    // const id = parseInt(req.params.id);
    // const task=tasks.find((t) => t.id ==id);
    res.status(HttpStatusCode.OK).json({
        status: 'success',
        results: 1,
        requestTime: req.requestTime,
        data:{
            task
        }
    })

})

const createTask = catchAsync(async (req, res, next)=>{
    
    const body = req.body;
    let day = Date.parse(body.day);  // Use Date.parse() to validate the date string

    // Log the parsed date to see what it returns
    console.log('Parsed day:', day);

    // Check if the date is valid
    if (isNaN(day)) {
        return res.status(400).json({
            status: 'fail',
            message: 'Invalid date format provided.',
        });
    }

    // If the 'day' field is invalid, use the current date
    if (body.day && isNaN(day)) {
        day = new Date();  // Default to current date if invalid
    }
    const newTask= await Task.create({
        text: body.text,
        day: day,
        reminder: body.reminder
    });
    res.status(HttpStatusCode.CREATED).json({
        status: 'success',
        data:{
            Task: newTask
        }
    }) 
    
} )
 
const patchTask = catchAsync( async (req, res, next)=>{
    
    const taskId= req.params.id;
    const query=  Task.findByIdAndUpdate(taskId, req.body,{
        new:true,
    });
    const task = await query.select('-__v');
    res.status(HttpStatusCode.OK).json({
        status: 'success',
        data:{
            task
        }
    }) 
    
    
})

const putTask = catchAsync( async (req, res, next) => {
    
    const taskId = req.params.id; // The ID of the task to update
    const body = req.body; // The data to update the task with


    // Try to find and update the task in the database
    const task = await Task.findByIdAndUpdate(
        taskId,
        { ...body },
        { new: true, upsert: true } // `upsert: true` ensures that a new task is created if not found
    ).select('-__v'); // Exclude the `__v` field

    if (!task) {
        return res.status(HttpStatusCode.NOT_FOUND).json({
            status: 'error',
            message: 'Task not found',
        });
    }

    res.status(HttpStatusCode.OK).json({
        status: 'success',
        data: {
            task,
        },
    });
    
});


const deleteTask = catchAsync( async(req, res, next)=>{
    
    const taskId = req.params.id;
    await Task.findByIdAndDelete(taskId);
    res.status(HttpStatusCode.NO_CONTENT).json({
        status: 'success',
        results: 1,
        data:null
    })
});

module.exports = {
    getAllTasks,
    getTask,
    createTask,
    patchTask,
    putTask,
    deleteTask
}