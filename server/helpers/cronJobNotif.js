require('dotenv').config();

var CronJob = require('cron').CronJob;
var kue = require('kue')
  , queue = kue.createQueue();

var AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.amazon_accessKeyId,
  secretAccessKey: process.env.amazon_secretAccessKey,
  region: 'ap-southeast-1'
});
// ap-southeast-1
// us-west-2

// new CronJob('* * * * * *', function() {

exports.createNotif = (user, task) => {

  // parse dueDate
  console.log(`********** createNotif ${task.due_date}**************`)

  var date = new Date(task.due_date);
  console.log("date", date);
  var hour = date.getHours();
  var minute = date.getMinutes();
  console.log("date.getHours()=", date.getHours());
  console.log("date.getMinutes()=", date.getMinutes());

  var message = `GRIT Task Reminder - Hi ${user.name}, you have one task that is due now: "${task.name}"`

  new CronJob(`00 ${minute} ${hour} * * 1-5`, function() {

    var job = queue.create('sendNotif', {
        message: message,
        name: user.name,
        phone: '+6281336410258',
        email: 'ijosuki@gmail.com'
    }).save( function(err){
       if( !err ) console.log( job.id );
    });

    // var job = queue.create('sendNotif', {
    //     message: 'second message',
    //     name: user.name,
    //     phone: '+6281336410258',
    //     email: 'ijosuki@gmail.com'
    // }).save( function(err){
    //    if( !err ) console.log( job.id );
    // });


    queue.process('sendNotif', function(job, done) {
      // email(job.data.to, done);
      sendEmail(job.data)
      sendSms(job.data)

      // not working
      // sendEmailAwsSes(job.data)
      done()
    })

    console.log('You will see this message every second');
  }, null, true, 'Asia/Jakarta');
}


function sendSms(params) {

  var sns = new AWS.SNS();
  console.log('*** params', params)
  var params = {
    Message: params.message,
    PhoneNumber: params.phone,
  };
  sns.publish(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });

  console.log('send sms bitches')

}

function sendEmail(params) {
  console.log("sending email");

  var send = require('gmail-send')({
    user: process.env.gmail_username,               // Your GMail account used to send emails
    pass: process.env.gmail_password,             // Application-specific password
    to:   params.email,               // Send back to yourself;
                                          // you also may set array of recipients:
                                          // [ 'user1@gmail.com', 'user2@gmail.com' ]
    // from:   '"User" <user@gmail.com>'  // from: by default equals to user
    // replyTo:'user@gmail.com'           // replyTo: by default undefined
    subject: 'GRIT',
    text:    params.message
    // html:    '<b>html text text</b>'
  });

  send({}, function (err, res) {
    console.log('* [example1] send(): err:', err, '; res:', res);
    console.log('send email bitches')

  });


}


function sendEmailAwsSes(params) {
  // load AWS SES
  var ses = new AWS.SES({apiVersion: '2010-12-01'});

  // send to list
  var to = ['ijosuki@gmail.com']

  // this must relate to a verified SES account
  var from = 'zomgpwnz@gmail.com'
  // this sends the email
  // @todo - add HTML version

  ses.sendEmail( {
     Source: from,
     Destination: { ToAddresses: to },
     Message: {
         Subject: {
            Data: 'GRIT'
         },
         Body: {
             Text: {
                 Data: params.message,
             }
          }
     }
  }
  , function(err, data) {
      if(err) throw err
          console.log('Email sent via AWS SES bitches');
          console.log(data);
   });

}
