import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import { Formik, } from 'formik';
import Axios from 'axios';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
});

class PacificaForm extends Component {
    state = {
        initialValues: {}
    }
    handleSubmit = props => (values, { setSubmitting }) => {
        Axios[props.method](`${props.md_url}/${props.object}`, values)
            .then((res) => {
                // Update react-table
                setSubmitting(false);
            })
    }
    componentDidMount() {
        this.props.initialValues((saveValues) => {
            let newValues = {};
            this.props.inputs.map((input) => {
                newValues[input.id] = saveValues[input.id];
                return input.value;
            });
            this.setState({ initialValues: newValues });
        });
    }
    render() {
        const {
            classes,
            inputs
        } = this.props;
        return (
            <Formik
                enableReinitialize={true}
                className={classes.container}
                initialValues={this.state.initialValues}
                onSubmit={this.handleSubmit(this.props)}
            >
                {
                    props => {
                        const {
                            values,
                            dirty,
                            isSubmitting,
                            handleChange,
                            handleSubmit,
                            handleReset,
                            handleBlur,
                        } = props;
                        let fields = inputs.map((input) => {
                            return (
                                <TextField
                                    className={classes.textField}
                                    InputLabelProps={{ shrink: true, }}
                                    margin="normal"
                                    value={values[input.id] ? values[input.id] : ""}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    {...input}
                                />
                            );
                        });
                        return (
                            <form onSubmit={handleSubmit}>
                                {fields}
                                <Button type="button" className="outline" onClick={handleReset} disabled={!dirty || isSubmitting}>Reset</Button>
                                <Button type="submit" disabled={isSubmitting}>Submit</Button>
                            </form>
                        );
                    }
                }
            </Formik>
        )
    }
}

PacificaForm.defaultProps = {
    initialValues: () => { }
}
PacificaForm.propTypes = {
    classes: PropTypes.object.isRequired,
    object: PropTypes.instanceOf(String).isRequired,
    md_url: PropTypes.instanceOf(String).isRequired,
    method: PropTypes.instanceOf(String).isRequired,
    inputs: PropTypes.instanceOf(Array).isRequired,
};

export default withStyles(styles)(PacificaForm);
