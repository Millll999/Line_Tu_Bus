const EvaluationMessage = 
{
  type:'flex', 
  altText: "ประเมิณระบบรถโรงเรียน",
  contents: {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "การประเมิณระบบรถโรงเรียน"
        },
        {
          type: "button",
          action: {
            type: "uri",
            label: "แบบประเมิณ",
            uri: "https://example.com/menu"

          },
          style: "primary",
          color: "#0000ff"
        },
      ],
    },
  }, 
}
const HelpMessage = {
  type: 'flex',
  altText: 'This is a flex message',
  contents: {
    type: 'bubble',
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'text',
          text: 'เราจะช่วยเหลือท่านได้อย่างไร',
        },
        {
          type: 'button',
          action: {
            type: 'postback',
            label:'ติดต่อ Admin',
            data: 'buttonAdmin',
          },
          style: 'secondary',
          color: '#FFFFFF',
        },
        {
          type: 'button',
          action: {
            type: 'postback',
            label: 'คำถามที่พบบ่อยเกี่ยวกับ Line Chatbot',
            data: 'buttonQALine',
          },
          style: 'secondary',
          color: '#FFFFFF',
        },
      ],
    },
  },
}
const StatisticsMessage = {
  type: 'flex',
  altText: 'This is a flex message',
  contents: {
    type: 'bubble',
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'text',
          text: 'ต้องการสถิติในช่วงเวลาใด ?',
        },
        {
          type: 'button',
          action: {
            type: 'postback',
            label:'การเดินทางล่าสุด',
            data: 'buttonLatestTrip',
          },
          style: 'secondary',
          color: '#FFFFFF',
        },
        {
          type: 'button',
          action: {
            type: 'postback',
            label: 'การเดินทาง 5 ครั้งหลังสุด',
            data: 'buttonLatest5Trips',
          },
          style: 'secondary',
          color: '#FFFFFF',
        },
      ],
    },
  },
}
const ContactMessage = {
  type: 'flex',
  altText: 'This is a flex message',
  contents: {
    type: 'bubble',
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'text',
          text: 'เลือกข้อมูลผู้ติดต่อที่คุณต้องการ',
        },
        {
          type: 'button',
          action: {
            type: 'postback',
            label:'คนขับรถตู้',
            data: 'buttonContactDriver',
          },
          style: 'secondary',
          color: '#FFFFFF',
        },

        {
          type: 'button',
          action: {
            type: 'postback',
            label: 'โรงเรียน',
            data: 'buttonContactSchool',
          },
          style: 'secondary',
          color: '#FFFFFF',
        },
      ],
    },
  },
}
const ReportMessage = {
  type: 'flex',
  altText: 'This is a flex message',
  contents: {
    type: 'bubble',
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'text',
          text: 'โปรดเลือกหัวข้อที่จะทำการร้องเรียน',
        },
        {
          type: 'button',
          action: {
            type: 'uri',
            label:'ร้องเรียนคนขับ',
            uri: 'https://docs.google.com/forms/d/e/1FAIpQLSdpP-XXt1ciXijy_HdoaaQ9gG6mthsmV41DDaRleM4a7e62jw/viewform?usp=sf_link',
          },
          style: 'secondary',
          color: '#FFFFFF',
        },
        {
          type: 'button',
          action: {
            type: 'uri',
            label: 'ร้องเรียนรถตู้',
            uri: 'https://example.com/menu',
          },
          style: 'secondary',
          color: '#FFFFFF',
        },
        {
          type: 'button',
          action: {
            type: 'postback',
            label: 'ผลการร้องเรียน',
            data: 'buttonReportResult',
          },
          style: 'secondary',
          color: '#FFFFFF',
        },
      ],
    },
  },
}
const CancelMessage = {
  type: 'flex',
  altText: 'Cancel a trip',
  contents: {
    type: 'bubble',
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'text',
          text: 'ต้องการที่จะไม่เดินทางกับรถโรงเรียนในวันพรุ่งนี้',
        },
        {
          type: 'button',
          action: {
            type: 'postback',
            label:'ไม่เดินทางกับรถตู้',
            data: 'buttonCancelTrip',
          },
          style: 'secondary',
          color: '#FFFFFF',
        },
        {
          type: 'button',
          action: {
            type: 'postback',
            label: 'ย้อนกลับ',
            data: 'buttonBackward',
          },
          style: 'secondary',
          color: '#FFFFFF',
        },
      ],
    },
  },
}

export { EvaluationMessage, StatisticsMessage, ContactMessage, CancelMessage, HelpMessage, ReportMessage };



