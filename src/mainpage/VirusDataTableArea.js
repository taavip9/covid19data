import React from 'react';
import { readRemoteFile } from 'react-papaparse'
import moment from 'moment'
import Modal from 'react-modal';
import {CronJob} from 'cron';

export class VirusDataTableArea extends React.Component{

    state = {
        data: [],
        filterString:'',
        filteredData: [],
        showModal: false,
        selectedCountry:'',
        previousDayData:[],
        selectedCountryPreviousDayData:''
    };

    constructor(props) {
        super(props);
        this.state = { data: [],
            filterString:'',
            filteredData: [],
            showModal: false,
            selectedCountry:'',
            previousDayData:[],
            selectedCountryPreviousDayData:''
        };
        this.updateData = this.updateData.bind(this);
        new CronJob('00 00 00 * * *', this.fetchData(), null, true, 'Europe/Tallinn');
    }

    handleOpenModal(key) {
        var country
        var countryPreviousDayData
        this.state.filteredData.forEach(row => {
            if(key === row[1]){
                country = row;
            }
        });
        this.state.previousDayData.forEach(row=>{
           if(key === row[1]){
               countryPreviousDayData = row;
           }
        });
        this.setState({
            showModal: true,
            selectedCountry:country,
            selectedCountryPreviousDayData:countryPreviousDayData
        });
    }

    handleCloseModal() {
        this.setState({
            showModal: false,
            selectedCountryName:''
        });
    }

    fetchData() {
        let date = moment(new Date()).subtract(1,"days");
        let address = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/';
        readRemoteFile(address+moment(date).format('MM-DD-YYYY')+'.csv', {
            complete: (results) => this.updateData(results, false)
        });
        readRemoteFile(address+moment(date.subtract(1,"days")).format('MM-DD-YYYY')+'.csv', {
            complete: (results) => this.updateData(results, true)
        });
    }

    handleFilterInputChanged(event){
        var filteredData = this.state.data.filter(e=> e[1].toLowerCase().includes(event.target.value.toLowerCase()));
        this.setState({
            filterString: event.target.value,
            filteredData: filteredData
        })
    }

    addStatistics(filteredResults, result){
        filteredResults[3] = filteredResults[3]+ Number(result[3]);
        filteredResults[4] = filteredResults[4]+ Number(result[4]);
        filteredResults[5] = filteredResults[5]+ Number(result[5]);
        return filteredResults;
    }

    updateData(results, isPreviousDayStatistics){
        var filteredResults = [];
        filteredResults.push(["","Canada","",0,0,0,"",""]);
        filteredResults.push(["","US","",0,0,0,"",""]);
        filteredResults.push(["","Mainland China","",0,0,0,"",""]);
        filteredResults.push(["","Australia","",0,0,0,"",""]);
        results.data.forEach(result => {
            let countryName = result[1];
            if(countryName==="Mainland China"){
                filteredResults[2] = this.addStatistics(filteredResults[2], result);
            }else if(countryName==="US"){
                filteredResults[1] = this.addStatistics(filteredResults[1], result);
            }else if(countryName==="Canada"){
                filteredResults[0] = this.addStatistics(filteredResults[0], result);
            }else if(countryName==="Australia"){
                filteredResults[3] = this.addStatistics(filteredResults[3], result);
            }else{
                if(result.length!==1 && countryName!=="Country/Region"){
                    filteredResults.push(result);
                }
            }
        });
        filteredResults.sort((a,b) => b[3] - a[3]);
        if(!isPreviousDayStatistics){
            this.setState({
                data:filteredResults,
                filteredData:filteredResults
            })
        }else{
            this.setState({
                previousDayData:filteredResults
            })
        }
    }

    render() {
        return( <div>
                    <h1 className="display-3">
                        {"COVID19 cases by country"}
                    </h1>
                    <h1 className="display-4">
                        {"data fetched on " + moment(new Date()).format('MMMM Do YYYY')}
                    </h1>
                    <Modal isOpen={this.state.showModal}
                           contentLabel="Modal for details"
                           onRequestClose={() => this.handleCloseModal()}
                           shouldCloseOnOverlayClick={true}
                           ariaHideApp={false}
                           className="Modal"
                           >
                        <h1>
                            {this.state.selectedCountry[1]}
                        </h1>
                        <table className={"table table-borderless"}>
                            <tbody>
                                <tr>
                                    <td>
                                        Confirmed:
                                    </td>
                                    <td>
                                        {this.state.selectedCountry[3]}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Deaths:
                                    </td>
                                    <td>
                                        {this.state.selectedCountry[4]}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Recovered:
                                    </td>
                                    <td>
                                        {this.state.selectedCountry[5]}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        New infected:
                                    </td>
                                    <td>
                                        {(Number.parseInt(this.state.selectedCountry[3])-Number.parseInt(this.state.selectedCountryPreviousDayData[3]))}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        New deaths:
                                    </td>
                                    <td>
                                        {(Number.parseInt(this.state.selectedCountry[4])-Number.parseInt(this.state.selectedCountryPreviousDayData[4]))}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <button className={"btn btn-info"} onClick={() => this.handleCloseModal()}>Close</button>
                    </Modal>
                    <input
                        className={"form-control"}
                        placeholder="Search for country name"
                        type="text"
                        value={this.state.filterString}
                        onChange={(event) => {this.handleFilterInputChanged(event)}}/>
                    <table className={"table"}>
                        <thead className={"thead-dark"}>
                            <tr>
                                <th>
                                    Country
                                </th>
                                <th>
                                    Infected
                                </th>
                                <th>
                                    Deaths
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.state.filteredData.map((row) => (
                            <tr key={row} onClick={() => this.handleOpenModal(row[1])}>
                                <td>
                                    {row[1]}
                                </td>
                                <td>
                                    {row[3]}
                                </td>
                                <td>
                                    {row[4]}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
        );
    }
}