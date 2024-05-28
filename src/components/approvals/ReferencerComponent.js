import React from 'react';
import styles from '../../css/approval/ReferencerComponent.module.css';
import { fontSize, fontWeight } from '@mui/system';

const ReferencerComponent = ({ referencers }) => {

    const maxReferencers = 6;
    const filledReferencer = [...referencers];

    while (filledReferencer.length < maxReferencers) {
        filledReferencer.push({ positionName: '', departName: '', name: '' });
    }

    return (
        <div>
            <table className={styles.ReferencerTable}>
                <tr>
                    <td style={{ fontWeight: "bold", fontSize: "18px" }}>참조</td>
                    {filledReferencer.map((referencer, index) => (
                        <td key={index}>
                            {referencer.departName}
                            <div>
                                <span style={{ fontWeight:"bold", fontSize:"17px"}}>{referencer.name}</span> {referencer.positionName}
                            </div>
                        </td>
                    ))}
                </tr>
            </table>
        </div>
    );
}

export default ReferencerComponent;