import {configArr} from '../classes/configuration';

export const globalMix = {
    data(){
        return{
            //Contains API call point required vars
            config: {
                url: configArr.Global.url,
                key: configArr.Global.parameters.key
            }
        }
    },
    methods:{
        
    }
}