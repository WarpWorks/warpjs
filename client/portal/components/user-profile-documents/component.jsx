import { NAME } from './constants';

const ModalContainer = window.WarpJS.ReactComponents.ModalContainer;

const Component = (props) => {
    return (
        <ModalContainer id={NAME} title="Your Documents">
            <div>UserProfileDocuments</div>
        </ModalContainer>
    );
};

Component.displayName = NAME;

export default window.WarpJS.ReactUtils.errorBoundary(Component);
