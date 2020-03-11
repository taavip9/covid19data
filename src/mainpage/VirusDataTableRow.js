import React from 'react'

export class VirusDataTableRow extends React.Component{

    static defaultProps = {
        rowData:{}
    };

    render() {
        return(
            <tr key={this.props.rowData} onClick={()=>{this.props.handleOpenModalClicked()}}>
                <td>
                    {this.props.rowData[1]}
                </td>
                <td>
                    {this.props.rowData[3]}
                </td>
                <td>
                    {this.props.rowData[4]}
                </td>
            </tr>
        );
    }
}