import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import './PacificaTable.css';
import edit_icon from './edit-obj.svg';
import arrows_icon from './double_arrow.svg'
import PacificaModal from './PacificaModal';
import PacificaForm from './PacificaForm';
import PacificaRelations from './PacificaRelations';
import user_inputs from './users_input.json';
import instrument_inputs from './instrument_input.json';
import project_inputs from './proposal_input.json';
import { getData } from './helper';


class PacificaTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [{ _id: 1 }],
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
                <PacificaModal
                    action='Create'
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
                    <PacificaForm inputs={input_map[this.props.object]} md_url="/mdapi" object={this.props.object} method="put" />
                </PacificaModal>
                <ReactTable
                    filterable={true}
                    data={this.state.data}
                    pages={this.state.pages}
                    columns={
                        [
                            {
                                Header: 'Actions',
                                accessor: '_id',
                                filterable: false,
                                Cell: row => (
                                    <div>
                                        <PacificaModal
                                            className="PacificaFloatLeft"
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
                                        <PacificaModal
                                            className="PacificaFloatRight"
                                            action='Relationships'
                                            action_image={
                                                <img src={arrows_icon} alt="" style={{ width: '20px' }} />
                                            }
                                            obj_nice_name={this.props.object_nice_name}
                                            obj_name={this.props.object}
                                        >
                                            <PacificaRelations
                                                md_url={this.props.md_url}
                                                object={this.props.object}
                                                object_nice_name={this.props.object_nice_name}
                                                object_id={row.row._id}
                                            />
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
