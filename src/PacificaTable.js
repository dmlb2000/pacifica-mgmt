import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Axios from 'axios';
import './PacificaTable.css';
import edit_icon from './edit-obj.svg';
import PacificaModal from './PacificaModal';
import PacificaForm from './PacificaForm';
import user_inputs from './users_input.json';
import instrument_inputs from './instrument_input.json';
import project_inputs from './proposal_input.json';

function filtered_to_where_args(filtered) {
    let where_arg_list = [];
    for (let i = 0; i < filtered.length; i++) {
        if (filtered[i].id === '_id') {
            return `_id=${filtered[i].value}`;
        }
        where_arg_list.push(`${filtered[i].id}=${filtered[i].value}%&${filtered[i].id}_operator=like`)
    }
    return where_arg_list.join('&')
}

function getData(md_url, object, filtered, pageSize, pageNum, saveData, savePages) {
    let where_args = filtered_to_where_args(filtered)
    // fetch your data
    Axios.get(`${md_url}/objectinfo/${object}?${where_args}`)
        .then((res) => {
            // Update react-table
            savePages(Math.ceil(res.data.record_count / pageSize));
            Axios.get(`${md_url}/${object}?items_per_page=${pageSize}&page_number=${pageNum + 1}&${where_args}`)
                .then((res) => {
                    // Update react-table
                    saveData(res.data);
                })
        })
}

class PacificaTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            filtered: [],
            pages: -1,
            pageNum: 0,
            pageSize: 20,
            loading: true,
        };
    }
    render() {
        const input_map = {
            instruments: instrument_inputs,
            proposals: project_inputs,
            users: user_inputs
        }
        return (
            <div>
                <ReactTable
                    filterable={true}
                    data={this.state.data}
                    columns={
                        [
                            {
                                Header: 'Actions',
                                accessor: '_id',
                                filterable: false,
                                Cell: row => (
                                    <div>
                                        <PacificaModal
                                            action='Edit'
                                            action_image={
                                                <img src={edit_icon} alt="Edit" style={{ width: '20px' }} />
                                            }
                                            obj_nice_name={this.props.object_nice_name}
                                            obj_name={this.props.object}
                                            onCloseRefresh={() => {
                                                getData(
                                                    this.props.md_url,
                                                    this.props.object,
                                                    this.state.filtered,
                                                    this.state.pageSize,
                                                    this.state.pageNum,
                                                    (data) => { this.setState({ data: data }) },
                                                    (pages) => { this.setState({ pages: pages }) }
                                                )
                                            }}
                                        >
                                            <PacificaForm
                                                inputs={input_map[this.props.object]}
                                                md_url="/mdapi"
                                                object={this.props.object}
                                                method="post"
                                                initialValues={(saveValues) => {
                                                    getData(
                                                        this.props.md_url,
                                                        this.props.object,
                                                        [{ id: '_id', value: row.row._id }],
                                                        1, 0,
                                                        (data) => { saveValues(data[0]) }, () => { }
                                                    )
                                                }} />
                                        </PacificaModal>
                                    </div>
                                )
                            }
                        ].concat(this.props.columns)
                    }
                    manual
                    onFetchData={(state, instance) => {
                        this.setState({
                            loading: true
                        })
                        getData(
                            this.props.md_url,
                            this.props.object,
                            state.filtered,
                            state.pageSize,
                            state.page,
                            (data) => { this.setState({ data: data, loading: false }) },
                            (pages) => { this.setState({ pages: pages }) }
                        )
                    }}
                    onFilteredChange={filtered => this.setState({ filtered: filtered })}
                    onPageChange={pageNum => this.setState({ pageNum: pageNum })}
                    onPageSizeChange={pageSize => this.setState({ pageSize: pageSize })}
                />
            </div>
        );
    }
}

PacificaTable.propTypes = {
    columns: PropTypes.instanceOf(Array).isRequired,
    object: PropTypes.instanceOf(String).isRequired,
    object_nice_name: PropTypes.instanceOf(String).isRequired,
    md_url: PropTypes.instanceOf(String).isRequired,
};

export default PacificaTable;
