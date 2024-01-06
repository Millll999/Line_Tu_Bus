import line from '@line/bot-sdk';
import cron from 'node-cron';
import supabase from "./Util/supabase.js";
import { client, userId, lineConfig } from './Util/LineClient.js';
import { EvaluationMessage, CancelMessage, StatisticsMessage, ContactMessage, HelpMessage, ReportMessage } from './View/line.js';
import { formatdrivers, formatReportstatus, formatReportstatus1, formatcontactdrivers, formatLatestTrip } from './View/format.js';

function configureLineBot(app) {
    //Webhook
    app.post('/', line.middleware(lineConfig), (req, res) => {
        try{
        const events = req.body.events;
        events.map(item => handleEvent(item));
        console.log('event ==>', events);
        res.sendStatus(200);
        }catch(error){
          res.status(500).end(
        )};
    });
    //Scheduled Message to evaluate send every 30th in every month
    cron.schedule('0 0 30 * *', () => {
      client.pushMessage(userId, EvaluationMessage)
        .then(() => {
        console.log('Message sent!');
        })
        .catch((err) => {
        console.error('Failed', err);
        });
    });
    //Event
    const handleEvent = async (event) => {
        //Accept userID of parents and update in Database
        const UserID = event.source.userId;
      if(event.type === 'message' && event.message.type === 'text') {

          //Reply Message for statistics button
          const userMessage = event.message.text;
          if(userMessage.toLowerCase() === 'statistics') {
            return client.replyMessage(event.replyToken, StatisticsMessage);

          //Reply Message for contact button
          }else if(userMessage.toLowerCase() === 'contacts'){
            return client.replyMessage(event.replyToken, ContactMessage);

          //Reply Message for help button 
          }else if(userMessage.toLowerCase() === 'help'){
            return client.replyMessage(event.replyToken, HelpMessage);

          //Reply Message for report button
          }else if(userMessage.toLowerCase() === 'report'){
            return client.replyMessage(event.replyToken, ReportMessage);

          //Reply Message for cancel buttom
          }else if(userMessage.toLowerCase() === 'cancel trip'){
            return client.replyMessage(event.replyToken, CancelMessage);

          //Algorithm for checking parent and keep user_id to matched database
          }else if(event.type === 'message' && event.message.type === 'text'){
              const parentName = event.message.text;
              const { data, error: parentError } = await supabase
              .from('parents')
              .select('*')
              .eq('parent_name_eng', parentName);
          
            if (parentError) {
              console.error('Supabase error:', parentError);
            } else if (data && data.length > 0) {
              const { data , error: updateError } = await supabase
                .from('parents')
                .update({ user_id: UserID })
                .eq('parent_name_eng', parentName);
          
              if (updateError) {
                console.error('Supabase error:', updateError);
              } else {
                console.log('User ID inserted into the matching row!');
                client.replyMessage(event.replyToken, { type: 'text', text: 'ขอบคุณสำหรับการลงทะเบียน' });
                return;
              }
            } else {
              console.log('No matching row found');
              return;
              //client.replyMessage(event.replyToken, { type: 'text', text: 'Parent name not found' });
            }
          }
        
      }
        //Postback action
        else if(event.type === 'postback' && event.postback.data){
          const buttonData = event.postback.data;
          let replyMessage;
          let formattedData;
          //For statistics flex
          //Latest Trip
          if(buttonData === 'buttonLatestTrip'){
            const { data: parents, error: parentError } = await supabase
            .from('parents')
            .select('*')
            .eq('user_id', UserID)

            if (parentError) {
             return console.error('Supabase error:', parentError);
            }

            if(parents && parents.length > 0){
              const parent = parents[0];
              const parentPrimaryKey = parent.id;
              const { data: parent_student, error: parent_studentError } = await supabase
              .from('parent_student')
              .select('student_id')
              .eq('parent_id', parentPrimaryKey);

              if (parent_studentError) {
               return console.error('Supabase error:', studentError);
              }

              if (parent_student && parent_student.length > 0) {
                const student = parent_student[0];
                const studentPrimaryKey = student.student_id;
                const { data: students, error: studentError } = await supabase
                .from('students')
                .select('*')
                .eq('id', studentPrimaryKey);


                if(studentError) {
                  return console.error('Supabase error:', studentError);
                }

                if(students && students.length > 0){
                  const busNos = students.map((student) => student.bus_no);
                  const { data: drivers, error: driverError } = await supabase
                    .from('drivers')
                    .select('*')
                    .in('bus_no', busNos);

                  if (driverError) {
                    return console.error('Supabase error:', driverError);
                  }

                  if(drivers && drivers.length > 0) {
                    if(students && students.length > 0){
                    formattedData = formatLatestTrip(students, drivers)
                    replyMessage = {
                      type: 'text',
                      text: `\n${formattedData}`,
                    };
                    return client.replyMessage(event.replyToken, replyMessage);
                    }
                  }
                }
              } 
            }
          }
          //Latest 5 Trips(Not Done Yet)
          else if(buttonData === 'buttonLatest5Trips'){
            const { data: drivers, error } = await supabase
            .from('drivers')
            .select('stats_avg_speed')

            if (error) {
              return console.error('Supabase error:', error).end();
            }

            if (drivers && drivers.length > 0) {
              formattedData = formatdrivers(drivers);
              replyMessage = {
                type: 'text',
                text: `Stats for the last 5 trips:\n${formattedData}`,
              };
              return client.replyMessage(event.replyToken, replyMessage)
            }
          }
          //For contacts flex
          //Contact Drivers
          else if(buttonData === 'buttonContactDriver'){
            const { data: parents, error: parentError } = await supabase
              .from('parents')
              .select('*')
              .eq('user_id', UserID)

            if (parentError) {
             return console.error('Supabase error:', parentError);
            }

            if(parents && parents.length > 0){
              const parent = parents[0];
              const parentPrimaryKey = parent.id;
              const { data: parent_student, error: parent_studentError } = await supabase
              .from('parent_student')
              .select('student_id')
              .eq('parent_id', parentPrimaryKey);

              if (parent_studentError) {
               return console.error('Supabase error:', studentError);
              }

              if (parent_student && parent_student.length > 0) {
                const student = parent_student[0];
                const studentPrimaryKey = student.student_id;
                const { data: students, error: studentError } = await supabase
                .from('students')
                .select('*')
                .eq('id', studentPrimaryKey);


                if(studentError) {
                  return console.error('Supabase error:', studentError);
                }
                if(students && students.length > 0){
                  const busNos = students.map((student) => student.bus_no);
                  const { data: drivers, error: driverError } = await supabase
                    .from('drivers')
                    .select('*')
                    .in('bus_no', busNos);

                  if (driverError) {
                    return console.error('Supabase error:', driverError);
                  }
                
                  if (drivers && drivers.length > 0) {
                    if(students && students.length > 0){
                      formattedData = formatcontactdrivers(drivers);
                      replyMessage = {
                        type: 'text',
                        text: `${formattedData}`,
                      };
                      return client.replyMessage(event.replyToken, replyMessage);
                    }
                  }
                } 
              }
            }
          }
          //Contact School
          else if(buttonData === 'buttonContactSchool'){
            return client.replyMessage(event.replyToken, {type: 'text', text: 'เบอร์ติดต่อโรงเรียน: 0000000000'})
          }
          //For Cancel flex
          //Cancel 
          else if(buttonData === 'buttonCancelTrip'){
            const { data: parents, error: parentError } = await supabase
              .from('parents')
              .select('*')
              .eq('user_id', UserID);

            if(parentError){
              return console.error('Supabase error:', parentError);
            }

            if(parents && parents.length > 0){
              const parent = parents[0];
              const parentPrimaryKey = parent.id;
              const { data: parent_student, error: parent_studentError } = await supabase
                .from('parent_student')
                .select('student_id')
                .eq('parent_id', parentPrimaryKey);

              if(parent_studentError){
                return console.error('Supabase error:', studentError);
              }

              if(parent_student && parent_student.length > 0){
                const student = parent_student[0];
                const studentPrimaryKey = student.student_id;
                const { data: students, error: studentError } = await supabase
                  .from('students')
                  .select('*')
                  .eq('id', studentPrimaryKey);

                if(studentError) {
                  return console.error('Supabase error:', studentError);
                }

                if(students && students.length > 0){
                  const student = students[0];
                  const { data: updatedStudents, error: updateError } = await supabase
                    .from('cancel')
                    .update({ attendance: false })
                    .eq('student_id', student.id);

                  if (updateError) {
                    return console.error('Supabase error:', updateError);
                  }
                  return client.replyMessage(event.replyToken, { type: 'text', text: 'หากท่านต้องการที่จะให้รถโรงเรียนไปรับบุตรหลานของท่านสามารถกดปุ่ม"ย้อนกลับ" ก่อนเวลา 6:00 ของทุกวัน' });
                }
              }
            }
          }
          //Return
          else if(buttonData === 'buttonBackward'){
            const { data: parents, error: parentError } = await supabase
              .from('parents')
              .select('*')
              .eq('user_id', UserID);

            if(parentError){
              return console.error('Supabase error:', parentError);
            }

            if(parents && parents.length > 0){
              const parent = parents[0];
              const parentPrimaryKey = parent.id;
              const { data: parent_student, error: parent_studentError } = await supabase
                .from('parent_student')
                .select('student_id')
                .eq('parent_id', parentPrimaryKey);

              if(parent_studentError){
                return console.error('Supabase error:', studentError);
              }

              if(parent_student && parent_student.length > 0){
                const student = parent_student[0];
                const studentPrimaryKey = student.student_id;
                const { data: students, error: studentError } = await supabase
                  .from('students')
                  .select('*')
                  .eq('id', studentPrimaryKey);

                if(studentError) {
                  return console.error('Supabase error:', studentError);
                }

                if(students && students.length > 0){
                  const student = students[0];
                  const { data: updatedStudents, error: updateError } = await supabase
                    .from('cancel')
                    .update({ attendance: true })
                    .eq('student_id', student.id);

                  if (updateError) {
                    return console.error('Supabase error:', updateError);
                  }
                  return client.replyMessage(event.replyToken, { type: 'text', text: 'หากท่านประสงค์ที่จะ "ไม่ให้รถโรงเรียนไปรับบุตรหลานของท่าน" สามารถกดปุ่ม "ไม่เดินทางกับรถตู้" ก่อนเวลา 6:00 ของทุกวัน' });
                }
              }
            }
          }
          //Report Status
          else if (buttonData === 'buttonReportResult') {
            const { data: parents, error: parentError } = await supabase
              .from('parents')
              .select('*')
              .eq('user_id', userId);
              
            if (parentError) {
              return console.error('Supabase error:', parentError);
            }
                
            if (parents && parents.length > 0) {
              const parent = parents[0];
              const parentPrimaryKey = parent.id;
              const { data: unresolvedReports, error: unresolvedReportsError } = await supabase
                .from('reports')
                .select('*')
                .eq('status', 'resolved')
                .eq('readingstatus', false)
                .eq('parent_id', parentPrimaryKey);

              if (unresolvedReportsError) {
                return console.error('Supabase error:', unresolvedReportsError);
              }

              if (unresolvedReports && unresolvedReports.length > 0) {
                const formatData1 = formatReportstatus(unresolvedReports);
                const replyMessage1 = {
                  type: 'text',
                  text: `${formatData1}`,
                };
                const promises = [
                  client.replyMessage(event.replyToken, replyMessage1), supabase
                    .from('reports')
                    .update({ readingstatus: true })
                    .in('id', unresolvedReports.map((report) => report.id)),
                ];            
                  await Promise.all(promises);
                }else{
                  const { data: resolvedReports, error: resolvedReportsError } = await supabase
                    .from('reports')
                    .select('*')
                    .eq('readingstatus', true)
                    .eq('parent_id', parentPrimaryKey);
              
                  if (resolvedReportsError) {
                    return console.error('Supabase error:', resolvedReportsError);
                  }
                  if (resolvedReports && resolvedReports.length > 0) {
                    const formatData2 = formatReportstatus1(resolvedReports);
                    const replyMessage2 = {
                      type: 'text',
                      text: `${formatData2}`,
                    };
                      client.replyMessage(event.replyToken, replyMessage2);
                  }
                }
              }
          }
        } 
    }
}            
export { configureLineBot };
