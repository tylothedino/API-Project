const ConfirmDeleteModal = ({ onDelete, onClose, message, type }) => (
    <div className="deleteBox">
        <h2>Confirm Delete</h2>
        <p>{message}</p>
        <button className="deleteConfirm" onClick={onDelete}>Yes (Delete {type})</button>
        <button className="deleteClose" onClick={onClose}>No (Keep {type})</button>
    </div>
);

export default ConfirmDeleteModal;
