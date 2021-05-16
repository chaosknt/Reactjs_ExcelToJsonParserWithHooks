import React, { useEffect, useState } from 'react';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import XLSX from 'xlsx';
import { make_cols } from './MakeColumns';
import { SheetJSFT } from './types';

const HookExcelReader = () => {

    const [data, setData] = useState({

        file: {},
        data: [],
        cols: []
    })
     
   const handleChange = (e) => {
        const files = e.target.files;
        if (files && files[0]) setData({...data, file: files[0] });        
    }
   
    const handleFile = (e) => {
       
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;
 
        reader.onload = (e) => {
        
            const bstr = e.target.result;
            const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA : true });
            
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            
            const dataReaded = XLSX.utils.sheet_to_json(ws);    
                        
            setData( { ...data, data: dataReaded, cols: make_cols(ws['!ref']) } );  

        };
        
        if (rABS) {
            reader.readAsBinaryString(data.file);       
        } else {
            reader.readAsArrayBuffer(data.file);
        };
         
    }

    const handleShowData = () => {
        console.log( data.data )
    }

    return (
        <div>
           <label htmlFor="file">Upload a file: Supported extensions 
           "xlsx", "xlsb", "xlsm", "xls", "xml", "csv", "txt", "ods", "fods", "uos", "sylk", "dif", "dbf", "prn", "qpw", "123", "wb*", "wq*", "html", "htm"
           </label>
            <br /><br />
            <input type="file" className="form-control" id="file" accept={SheetJSFT} onChange={handleChange} />
            <br /><br />
            <input type='submit' 
            value="Process Triggers"
            onClick={handleFile} /> <br /><br />
            <button onClick={handleShowData}>ShowData in Console</button>
          </div>
    )
}

export default HookExcelReader
