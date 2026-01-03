// const [approvalsPage, setApprovalsPage] = useState(1);
// const approvalRequests = [
//   {
//     id: 1,
//     employee: "Sarah Chen",
//     project: "Project Delta",
//     status: "Pending",
//     requestedBy: "John Doe",
//     date: "2025-11-25",
//   },
//   {
//     id: 2,
//     employee: "James Wilson",
//     project: "Project Echo",
//     status: "Approved",
//     requestedBy: "Jane Smith",
//     date: "2025-11-24",
//   },
// ];

// const requestApproval = (employee, project) => {
//   alert(
//     `Approval request sent to Department Head for ${employee.name} to join ${project.name}`
//   );
// };

// {
//   /* Approval Requests */
// }
// {
//   activeTab === "approvals" && (
//     <div className="content-card">
//       <h2 className="section-title">Approval Requests</h2>
//       <p className="section-description">
//         Request approval from Department Head for employee assignments
//       </p>

//       <div className="approval-list">
//         {paginateItems(approvalRequests, approvalsPage).map((request) => (
//           <div key={request.id} className="approval-card">
//             <div className="approval-header">
//               <div className="approval-info">
//                 <h3 className="approval-title">
//                   {request.employee} → {request.project}
//                 </h3>
//                 <p className="approval-meta">
//                   Requested by {request.requestedBy} on {request.date}
//                 </p>
//               </div>
//               <span
//                 className={`status-badge status-${request.status.toLowerCase()}`}
//               >
//                 {request.status}
//               </span>
//             </div>
//             {request.status === "Pending" && (
//               <div className="approval-actions">
//                 <button className="approve-btn">Approve</button>
//                 <button className="reject-btn">Reject</button>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//       <Pagination
//         currentPage={approvalsPage}
//         totalItems={approvalRequests.length}
//         itemsPerPage={ITEMS_PER_PAGE}
//         onPageChange={setApprovalsPage}
//       />

//       <div className="new-request-section">
//         <button
//           onClick={() => {
//             const emp = employees[0];
//             const proj = projects[0];
//             requestApproval(emp, proj);
//           }}
//           className="new-request-btn"
//         >
//           + New Approval Request
//         </button>
//       </div>
//     </div>
//   );
// }
