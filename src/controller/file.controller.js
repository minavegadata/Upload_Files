const uploadFile = require("../middleware/upload");
const fs = require('fs')
let XLSX = require('xlsx');
var Excel = require('exceljs');


const upload = async (req, res) => {

  try {
    let jsondata = []
    await uploadFile(req, res);
    let seperator = req.body.seperator
    if (req.body.type == 'CSV' || req.body.type == 'txt') {
      let data1 = fs.readFileSync(`resources/static/assets/uploads/${req.file.originalname}`, 'utf8')
      let lines = data1.split('\n');
      let line_data = []
      for (let l = 0; l < lines.length; l++) {
        let splitline = lines[l].split(seperator)
        line_data.push(splitline)
      }
      if (req.body.header == 'true') {
        headers = lines[0].split(seperator)

        for (let i = 1; i < 10; i++) {
          let temp_data = {}
          for (let j = 0; j < headers.length; j++) {

            temp_data[headers[j].replace(/[\r&\/\\#, +()$~%.'":*?<>{}]/g, '_')] = line_data[i][j]

          }
          jsondata.push(temp_data)
          console.log(jsondata)
        }
        //console.log(jsondata)
      }
      else {
        let dumy_headers = []
        for (let i = 1; i <= lines[0].split(seperator).length; i++) {
          dumy_headers.push(`coloumn_${i}`)
        }
        //console.log(dumy_headers)
        for (let i = 0; i < 10; i++) {
          let temp_data = {}
          for (let j = 0; j < dumy_headers.length; j++) {

            temp_data[dumy_headers[j].replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, '_')] = line_data[i][j]

          }
          jsondata.push(temp_data)
        }
      }
    } else if (req.body.type == "Excel") {
      if (req.body.header == 'true') {
        let workbook = XLSX.readFile(`resources/static/assets/uploads/${req.file.originalname}`);
        let sheet_name_list = workbook.SheetNames;
        let temp_output = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        jsondata = temp_output.filter((obj, index) => index < 10)
      }
      else {
        let workbook = XLSX.readFile(`resources/static/assets/uploads/${req.file.originalname}`, { sheetRows: 1 })
        let sheet_name_list = workbook.SheetNames;
        let sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {
          header: 1,
          defval: '',
          blankrows: true
        });
        let dumy_headers = []
        for (let i = 1; i <= sheetData[0].length; i++) {
          dumy_headers.push(`coloumn_${i}`)
        }
        let EXCELworkbook = new Excel.Workbook();
        EXCELworkbook.xlsx.readFile(`resources/static/assets/uploads/${req.file.originalname}`)
          .then(function () {
            let worksheet = EXCELworkbook.getWorksheet(1);
            worksheet.insertRow(1, dumy_headers);

            EXCELworkbook.xlsx.writeFile(`resources/static/assets/uploads/${req.file.originalname}`)

          });
        setTimeout(function () {
          let workbook2 = XLSX.readFile(`resources/static/assets/uploads/${req.file.originalname}`);
          let sheet_name_list2 = workbook.SheetNames;
          let temp_output = XLSX.utils.sheet_to_json(workbook2.Sheets[sheet_name_list2[0]]);
          jsondata = temp_output.filter((obj1, index1) => index1 < 10)
        }, 500);

      }
    }
    else if (req.body.type == "tsv") {
      if (req.body.header == 'true') {
        let workbook = XLSX.readFile(`resources/static/assets/uploads/${req.file.originalname}`);
        let sheet_name_list = workbook.SheetNames;
        let temp_output = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        jsondata = temp_output.filter((obj, index) => index < 10)
      } else {
        let data1 = fs.readFileSync(`resources/static/assets/uploads/${req.file.originalname}`, 'utf8')
        let lines = data1.split('\n');
        let line_data = []
        for (let l = 0; l < lines.length; l++) {
          let splitline = lines[l].split("\t")
          line_data.push(splitline)
        }
        let dumy_headers = []
        for (let i = 1; i <= lines[0].split("\t").length; i++) {
          dumy_headers.push(`coloumn_${i}`)
        }
        for (let i = 0; i < 10; i++) {
          let temp_data = {}
          for (let j = 0; j < dumy_headers.length; j++) {

            temp_data[dumy_headers[j].replace(/[\r&\/\\#, +()$~%.'":*?<>{}]/g, '_')] = line_data[i][j]
          }
          jsondata.push(temp_data)
        }
      }
    }
    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }
    setTimeout(() => {
      res.status(200).send({
        message: "Uploaded the file successfully: " + req.file.originalname,
        data: jsondata,
      });
    }, 500);
  } catch (err) {
    console.log(err);
    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }
    res.status(500).send({
      message: `Could not upload the file:. ${err}`,
    });
  }
};

module.exports = {
  upload,
 
};
