import { Table } from 'react-bootstrap';

import { NAME } from './constants';

const { errorBoundary } = window.WarpJS.ReactUtils;

const Component = (props) => {
    return (
        <Table striped bordered>
            <thead>
                <tr>
                    <th>Status</th>
                    <th>Prerequisites</th>
                    <th>Portal Visibility (Public!)</th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <td>
                        <span className={`warpjs-document-status warpjs-document-status-Draft`}>
                                Draft
                        </span>
                    </td>

                    <td>
                        <ul>
                            <li>
                                Initial status of new RH content
                            </li>
                        </ul>
                    </td>

                    <td>
                        <ul>
                            <li>
                                Not visible to the public
                            </li>
                        </ul>
                    </td>
                </tr>

                <tr>
                    <td>
                        <span className={`warpjs-document-status warpjs-document-status-Proposal`}>
                                Proposal
                        </span>
                    </td>

                    <td>
                        <ul>
                            <li>
                                Content contributed by IIC members is licensed automatically via membership agreement.
                            </li>
                            <li>
                                If content is contributed by non-members, license must be granted via Non-Member Contribution and License Agreement.
                            </li>
                        </ul>
                    </td>

                    <td>
                        <ul>
                            <li>
                                Visible in the public part of the portal
                            </li>
                            <li>
                                Content has an explicit legal disclaimer, marking the content as “Proposal”
                            </li>
                        </ul>
                    </td>
                </tr>

                <tr>
                    <td>
                        <span className={`warpjs-document-status warpjs-document-status-IndividualContribution`}>
                                IndividualContribution
                        </span>
                    </td>

                    <td>
                        <ul>
                            <li>
                                This is an individual contribution, not an official IIC document
                            </li>
                            <li>
                                Individual authors are listed in the sidebar
                            </li>
                        </ul>
                    </td>

                    <td>
                        <ul>
                            <li>
                                Visible to the public
                            </li>
                            <li>
                                Content has an explicit legal disclaimer, marking the content as “Individual Contribution”
                            </li>
                        </ul>
                    </td>
                </tr>

                <tr>
                    <td>
                        <span className={`warpjs-document-status warpjs-document-status-Approved`}>
                                Approved
                        </span>
                    </td>

                    <td>
                        <ul>
                            <li>
                                Final list of content authors and contributors has been properly linked to content
                            </li>
                            <li>
                                Content has been edited by IIC staff
                            </li>
                            <li>
                                Content has been approved by vote or other appropriate means in the responsible TG/WG
                            </li>
                        </ul>
                    </td>

                    <td>
                        <ul>
                            <li>
                                Visible in the public part of the portal
                            </li>
                            <li>
                                Content has the standard IIC legal disclaimer
                            </li>
                            <li>
                                No commenting by non-IIC members
                            </li>
                        </ul>
                    </td>
                </tr>

                <tr>
                    <td>
                        <span className={`warpjs-document-status warpjs-document-status-Declined`}>
                                Declined
                        </span>
                    </td>

                    <td>
                        <ul>
                            <li>
                                Content has been rejected by the responsible authority
                            </li>
                        </ul>
                    </td>

                    <td>
                        <ul>
                            <li>
                                Not visible to the public
                            </li>
                        </ul>
                    </td>
                </tr>

                <tr>
                    <td>
                        <span className={`warpjs-document-status warpjs-document-status-Retired`}>
                                Retired
                        </span>
                    </td>

                    <td>
                        <ul>
                            <li>
                                Content is no longer relevant.
                            </li>
                        </ul>
                    </td>

                    <td>
                        <ul>
                            <li>
                                Not visible to the public
                            </li>
                        </ul>
                    </td>
                </tr>

                <tr>
                    <td>
                        <span className={`warpjs-document-status warpjs-document-status-InheritFromParent`}>
                                InheritFromParent
                        </span>
                    </td>

                    <td>
                        <ul>
                            <li>
                                Content will inherit status from parent (see content hierarchy in the breadcrumb above)
                            </li>
                        </ul>
                    </td>

                    <td>
                        <ul>
                            <li>
                                Depending on document parent&apos;s status
                            </li>
                        </ul>
                    </td>
                </tr>
            </tbody>
        </Table>
    );
};

Component.displayName = `${NAME}Definition`;

export default errorBoundary(Component);
