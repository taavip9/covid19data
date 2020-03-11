import React from 'react'

export class CountryDetails extends React.Component{

    static defaultProps = {
        selectedCountry:{},
        selectedPreviousCountry:{}
    };

    render() {
        return(
            <>
                <h1>{this.props.selectedCountry[1]}</h1>
                <table className={"table table-borderless"}>
                    <tbody>
                    <tr>
                        <td>Confirmed:</td>
                        <td>{this.props.selectedCountry[3]}</td>
                    </tr>
                    <tr>
                        <td>Deaths:</td>
                        <td>{this.props.selectedCountry[4]}</td>
                    </tr>
                    <tr>
                        <td>Recovered:</td>
                        <td>{this.props.selectedCountry[5]}</td>
                    </tr>
                    <tr>
                        <td>New infected:</td>
                        <td>{(Number.parseInt(this.props.selectedCountry[3])-Number.parseInt(this.props.selectedPreviousCountry[3]))}</td>
                    </tr>
                    <tr>
                        <td>New deaths:</td>
                        <td>{(Number.parseInt(this.props.selectedCountry[4])-Number.parseInt(this.props.selectedPreviousCountry[4]))}</td>
                    </tr>
                    </tbody>
                </table>
                <button className={"btn btn-info"} onClick={() => this.props.handleCloseModal()}>Close</button>
            </>
        );
    }
}