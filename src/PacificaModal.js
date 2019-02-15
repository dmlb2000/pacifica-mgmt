import React from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root')

class PacificaModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false
        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal() {
        this.setState({
            modalIsOpen: true
        });
    }

    closeModal() {
        this.props.onCloseRefresh();
        this.setState({
            modalIsOpen: false
        });
    }

    render() {
        return (
            <div className={this.props.className}>
                <Button onClick={this.openModal}>{this.props.action_image ? this.props.action_image : this.props.action}</Button>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel={`${this.props.action} ${this.props.obj_nice_name}`}
                >
                    <h2 ref={subtitle => this.subtitle = subtitle}>{this.props.action} {this.props.obj_nice_name}</h2>
                    {this.props.children}
                    <Button onClick={this.closeModal}>Close</Button>
                </Modal>
            </div>
        );
    }
}

PacificaModal.defaultProps = {
    onCloseRefresh: () => { },
};

PacificaModal.propTypes = {
    action: PropTypes.instanceOf(String).isRequired,
    action_image: PropTypes.instanceOf(Object),
    obj_nice_name: PropTypes.instanceOf(String).isRequired,
    obj_name: PropTypes.instanceOf(String).isRequired,
};
export default PacificaModal;
