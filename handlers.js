const { CronJob } = require("cron")


console.log('Before job instantiation');
const job = new CronJob('00 28 23 * * *', function() {
	const d = new Date();
	console.log('Midnight:', d);
});
console.log('After job instantiation');
job.start();


const testFunc = () => {
    console.log("this is a test")
}


const scheduler = (scheduledTime, func) => {
    let testVar = ""
    func()
    counter = 0
    console.log("start")
    // setInterval(() =>{
    //     console.log(testVar)
    //     const timeNow = new Date().toLocaleTimeString("en-GB", {hour: '2-digit', minute:'2-digit'})
    //     const futureTime = new Date( new Date().getTime() + 60000).toLocaleTimeString("en-GB", {hour: '2-digit', minute:'2-digit'})
    //     console.log(`Current time is: ${timeNow}`)
    //     console.log(`Future time is: ${futureTime}`)
    //     testVar = "this is not a drill"
    //     if (scheduledTime === timeNow && counter === 0) {
    //         console.log("send text")
    //         console.log(`Alarm activated`)
    //         counter = 1
    //     } else if (scheduledTime === futureTime && counter === 1) {

    //     }
    // }, 2000);
    let timing

}

// scheduler("22:21", testFunc)

module.exports = {}
