function formatstudents(students) {
    let formattedData = '';
  
    students.forEach((student) => {
      formattedData += `หมายเลขรถตู้: ${student.bus_no}\n`;
      formattedData += `ชื่อนักเรียน: ${student.student_name_eng}`;
      formattedData += `นามสกุลนักเรียน: ${student.student_surname_eng}\n`;
      formattedData += '-----------------\n';
      formattedData += '*สถิติความเร็วในการเดินทางล่าสุด*\n';
    });
  
    return formattedData;
  }
function formatdrivers(drivers) {
    let formattedData = '';
  
    drivers.forEach((driver) => {
      const statsAvgSpeedJson = typeof driver.stats_avg_speed === 'string' ? JSON.parse(driver.stats_avg_speed) : driver.stats_avg_speed;
      if (statsAvgSpeedJson && statsAvgSpeedJson.avg_speed) {
        formattedData += `ความเร็วเฉลี่ย: ${statsAvgSpeedJson.avg_speed}\n`;
        formattedData += `เวลาในการเดินทาง: ${statsAvgSpeedJson.driveHours}\n`;
        formattedData += `ผลลัพธ์: ${statsAvgSpeedJson.result_stat}\n`;
        formattedData += '-----------------\n';
      }
    });
  
    return formattedData;
  }
function formatcontactdrivers(drivers) {
    let formattedData = '';
  
    drivers.forEach((driver) => {
      
      formattedData += `หมายเลขรถตู้: ${driver.bus_no}\n`
      formattedData += `เบอร์โทรติดต่อ: ${driver.driver_tel}\n`;
      formattedData += `Line ID: ${driver.line_id}\n`;
      formattedData += '-----------------\n';
    });
    return formattedData;
  }
function formatLatestTrip(students, drivers) {
    let formattedData = '';
  
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      const driver = drivers[i];
  
      formattedData += `หมายเลขรถตู้: ${student.bus_no}\n`;
      formattedData += `ชื่อนักเรียน: ${student.student_name_eng} ${student.student_surname_eng}\n`;
      formattedData += '=================\n';
      formattedData += '*สถิติความเร็วในการเดินทางล่าสุด*\n';
      
  
      const statsAvgSpeedJson = typeof driver.stats_avg_speed === 'string' ? JSON.parse(driver.stats_avg_speed) : driver.stats_avg_speed;
      formattedData += `ความเร็วเฉลี่ย: ${statsAvgSpeedJson.avg_speed}\n`;
      formattedData += `เวลาในการเดินทาง: ${statsAvgSpeedJson.driveHours}\n`;
      formattedData += `ผลลัพธ์: ${statsAvgSpeedJson.result_stat}\n`;
      formattedData += '=================\n';
    }
  
    return formattedData;
  }
function  formatReportstatus(reports){
    let formattedData = '';
    reports.forEach((report) => {
      formattedData += `*การรายงานของท่าน* \n${report.report_message}\n`;
      formattedData += `สถานะการรายงานของท่าน: \n${report.status}\n`
    });
    return formattedData;
  }
function  formatReportstatus1(reports){
    let formattedData = '';
    reports.forEach((report) => {
      formattedData += `*การรายงานของท่าน* \n${report.report_message}\n`;
      formattedData += `สถานะการรายงานของท่าน: \nระบบได้แก้ไขเรียบร้อยแล้ว\n`
    });
    return formattedData;
}

export { formatdrivers, formatReportstatus, formatReportstatus1, formatstudents, formatcontactdrivers, formatLatestTrip };