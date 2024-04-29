import chalk from "chalk";
import axios, { AxiosError } from "axios";

class logger {
    
    constructor(){
        this.message = {} ;
        this.code = null ;
        this.apiKey = null ;
        this.INFO = 'INFO' ;
        this.WARN = 'WARNING' ;
        this.ERROR = 'ERROR' ;
    }

    init({ code , apiKey } = {} ){

       this.message = {} ;

       return (req,res,next) => {

        let index = req.rawHeaders.indexOf('sec-ch-ua');

        this.message = {
            'body' : req.body ,
            'query' : req.query , 
            'parameter' : req.paramas ,
        }

        if(index !== -1 ){
            this.plateform = req.rawHeaders[index+1].split(',')[1].split(';')[0].replaceAll("\"","");
        }

        this.IP = req.ip ;
        this.method = req.method ;
        this.statusCode = res.statusCode ;
        this.time = new Date();
        this.path = req.path;

        this.log = {
            IP : req.ip , 
            statusCode : res.statusCode.toString() , 
            method : this.method ,
            time : new Date() , 
            path : req.path ,
            plateform : this.plateform
        }
    
           if(!code){
            console.log(chalk.blueBright('Error From Logger :') ,chalk.red('code is Required.'));
           }
    
           if(!apiKey){
            console.log(chalk.blueBright('Error From Logger :') ,chalk.red('apiKey is Required.'));
           }
           
            this.code = code ; 
            this.apiKey = apiKey ;
            next();

 
       }

    }

    invalidDetails(){
        console.log(chalk.red('Provide appropriate message'));
    }

    async info(data=null){

        try{

            if(this.apiKey == null || this.code == null || this.apiKey.trim().length == 0 || this.apiKey.trim().length == 0){
                console.log(chalk.blueBright('Error From Logger :') ,chalk.red('Initialize logger using init() method in middleware.'));
            }
            else if(data == null) {
                this.invalidDetails();
            }
            else{
                
                this.message.data = data ;

                this.log.category = this.INFO ;

                this.log.details = this.message ;

                const response = await this.apiCall('http://localhost:5000/api/log/create')

                this.printConsole(response);
                
            }
            
        }catch(error){
            if(error instanceof AxiosError){
                console.log(`${chalk.blueBright('Error From Logger : ')}${chalk.red(JSON.stringify(error.response.data))}`);
            }
        }

    }

    async error(error){

        try{
            
            if(this.apiKey == null || this.code == null){
                console.log(chalk.red('init() method is not called.'));
                console.log(chalk.red('Your log is not inserted.'));
                console.log(chalk.red('call init() method in middleware.'))
                console.log(chalk.red('Please follow the instruction'))
            }
            else if(error == null) {
                this.invalidDetails();
            }
            else if(error instanceof Error){
                
                this.message.data = error.stack;

                this.log.category = this.ERROR ;
                
                this.log.details = this.message ;

                this.log.errorName = error.name ;

                const response = await this.apiCall('http://localhost:5000/api/log/create');

                this.printErrorConsole(response);

            } else {
                console.log('Provide instance of error');
            }
        }catch(error){
            console.log('error',error);
            // if(error instanceof AxiosError){
            //     console.log(`${chalk.blueBright('Error From Logger : ')}${chalk.red(JSON.stringify(error.response.data))}`);
            // }
        }
    }

    async warning(data=null){
        try{

            if(this.apiKey == null || this.code == null){
                console.log(chalk.red('init() method is not called.'));
                console.log(chalk.red('Your log is not inserted.'));
                console.log(chalk.red('call init() method in middleware.'))
                console.log(chalk.red('Please follow the instruction'))
            }
            else if(data == null) {
                this.invalidDetails();
            }
            else{

                this.message.data = data ;

                this.log.category = this.WARN ;

                this.log.details = this.message ;

                const response = await this.apiCall('http://localhost:5000/api/log/create');

                this.printConsole(response);

            }
        }catch(error){
            if(error instanceof AxiosError){
                console.log(`${chalk.blueBright('Error From Logger : ')}${chalk.red(error.response.data)}`);
            }
        }
    }

    async apiCall(url) {
        try{
            const response = await axios.post(url,this.log,{
                headers : {
                    apiKey : this.apiKey ,
                    code : this.code 
                }
            })
            return response;
        }catch(error){
            throw error;
        }
    }

    printConsole(response){
        let consoleLog = `${chalk.yellow('Time : ')} ${response.data.data.time} ${chalk.yellow('Category : ')}${response.data.data.category} ${chalk.yellow('Plateform : ')}${response.data.data.plateform} ${chalk.yellow('IP : ')}${response.data.data.IP} ${chalk.yellow('Method : ')}${response.data.data.method} ${chalk.yellow('Path : ')}${response.data.data.path} ${chalk.yellow('StatusCode : ')}${response.data.data.statusCode} ${chalk.yellow('Priority : ')}${response.data.data.priority} ${chalk.yellow('Module : ')}${response.data.data.moduleName}`;
        console.log(consoleLog);
        response.data.data.details.data = response.data.data.details.data.replaceAll(/\n/g,'\n    ')
        console.log(`${chalk.yellow('Details : ')} ${JSON.stringify(response.data.data.details,null,2)}`)
    }

    printErrorConsole(response){
        let consoleLog = `${chalk.yellow('Time : ')} ${response.data.data.time} ${chalk.yellow('Category : ')}${response.data.data.category} ${chalk.yellow('Plateform : ')}${response.data.data.plateform} ${chalk.yellow('IP : ')}${response.data.data.IP} ${chalk.yellow('Method : ')}${response.data.data.method} ${chalk.yellow('Path : ')}${response.data.data.path} ${chalk.yellow('StatusCode : ')}${response.data.data.statusCode} ${chalk.yellow('Priority : ')}${response.data.data.priority} ${chalk.yellow('Module : ')}${response.data.data.moduleName}`;
        console.log(consoleLog);
        response.data.data.details.data = response.data.data.details.data.replaceAll(/\n/g,'\n    ');
        const { data , ...rest } = response.data.data.details;
        console.log(`${chalk.yellow('Details : ')} ${JSON.stringify(rest,null,2)}`);
        const [name,...error] = response.data.data.details.data.split(':');
        console.log(`${chalk.yellow(`${name.trim()} : `)} ${error.slice(0).join(':').trim()}`);
    }

}

export default new logger();
