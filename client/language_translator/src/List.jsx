import PropTypes from 'prop-types';

function List({ data }) {
    return (
        <ol >
            {data.map((item, index) => (
                <li className=" w-[30vw]" key={index}>{item}</li>
            ))}
        </ol>
    );
}

List.propTypes = {
    data: PropTypes.array.isRequired,
};

export default List;