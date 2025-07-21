// PendingTasks.jsx
const PendingTasks = ({ data }) => {
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800';
      case 'low': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          📋 Pending HR Actions
        </h3>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
          {data?.length || 0} items
        </span>
      </div>
      
      <div className="space-y-4">
        {data?.map((task) => (
          <div key={task.id} className="group flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg hover:from-blue-50 hover:to-blue-100 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-200 border border-transparent hover:border-blue-200 dark:hover:border-blue-700">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border-2 ${getPriorityColor(task.priority)} shadow-sm`}>
                  {getPriorityIcon(task.priority)} {task.priority?.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-base group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                  {task.title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <span className="font-medium">{task.count}</span> pending items • Due: {task.dueDate || 'No deadline'}
                </p>
              </div>
            </div>
            <button 
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              onClick={() => console.log(`Reviewing ${task.title}`)}
            >
              Review →
            </button>
          </div>
        ))}
      </div>
      
      {(!data || data.length === 0) && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">✅</div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">All caught up! No pending tasks.</p>
        </div>
      )}
    </div>
  );
};

export default PendingTasks;