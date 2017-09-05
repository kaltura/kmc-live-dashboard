import { Injectable } from '@angular/core';
import * as _ from "lodash";


@Injectable()
export class KalturaAPIConfig {

    private
    get kmcConfig():any {
        return _.get(window.parent,'kmc',null);
    }
    //noinspection TypeScriptUnresolvedVariable
    get ks():string {
        if (this.kmcConfig) {
            return this.kmcConfig.vars.ks;
        }
        return "djJ8MTgwMjM4MXzsPCZ1oaxPuBvErQZ6viTHqbchAhjjvJuvLYPStbsDWy40DkVQFG5nBILCpfJ3bI52xwR0-WbsrP0ryHr4WucXcp1JvbEcF_rQ5hy0uebgoyFIreIFA8D0Pg1PbyLMHtw="
    }

    get apiUrl():string {
        let baseUrl : string;
        if (this.kmcConfig) {
            baseUrl=this.kmcConfig.vars.api_url;
        } else {
            baseUrl = "https://www.kaltura.com";
        }
        return baseUrl + "/api_v3/index.php";
    }
    apiVersion : string;

    clientTag = 'kaltura/kaltura-api_v1';
    headers = {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'
    };
    format = 1;

}
