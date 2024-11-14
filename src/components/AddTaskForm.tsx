import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Calendar, AlignLeft, RefreshCw } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import { useSettingsStore } from '../store/settingsStore';
import { ImageUpload } from './ImageUpload';
import toast from 'react-hot-toast';

interface AddTaskFormProps {
  onClose: () => void;
}

export const AddTaskForm: React.FC<AddTaskFormProps> = ({ onClose }) => {
  const { addTask } = useTaskStore();
  const { darkMode } = useSettingsStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [toDoDate, setToDoDate] = useState(new Date().toISOString().split('T')[0]);
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [repeatEveryDays, setRepeatEveryDays] = useState(1);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    setIsSubmitting(true);
    try {
      await addTask({
        title: title.trim(),
        description: description.trim(),
        dueDate: new Date(toDoDate),
        status: 'To do',
        priority: 'medium',
        images,
        assigneeId: null,
        isRepeating,
        repeatEveryDays: isRepeating ? repeatEveryDays : undefined,
        importance: 'normal'
      });
      onClose();
    } catch (error) {
      // Error handling is done in the store
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center overflow-y-auto"
    >
      <div className="min-h-screen py-8 px-4 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className={`${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } rounded-lg shadow-xl w-full max-w-lg pointer-events-auto`}
        >
          <form onSubmit={handleSubmit}>
            <div className={`flex justify-between items-center p-6 border-b ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h2 className={`text-2xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>New Task</h2>
              <button
                type="button"
                onClick={onClose}
                className={`p-2 rounded-full ${
                  darkMode
                    ? 'hover:bg-gray-700 text-gray-400'
                    : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label htmlFor="title" className={`block text-sm font-medium mb-1 ${
                  darkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full px-3 py-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'border-gray-300 text-gray-900'
                  }`}
                  placeholder="Enter task title"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className={`block text-sm font-medium mb-1 ${
                  darkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className={`w-full px-3 py-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'border-gray-300 text-gray-900'
                  }`}
                  placeholder="Enter task description"
                />
              </div>

              <div>
                <label htmlFor="toDoDate" className={`block text-sm font-medium mb-1 ${
                  darkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  To Do Date
                </label>
                <input
                  type="date"
                  id="toDoDate"
                  value={toDoDate}
                  onChange={(e) => setToDoDate(e.target.value)}
                  className={`w-full px-3 py-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isRepeating"
                    checked={isRepeating}
                    onChange={(e) => setIsRepeating(e.target.checked)}
                    className={`h-4 w-4 rounded focus:ring-blue-500 ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-blue-600'
                        : 'border-gray-300 text-blue-600'
                    }`}
                  />
                  <label htmlFor="isRepeating" className={`ml-2 block text-sm ${
                    darkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    Repeating Task
                  </label>
                </div>

                {isRepeating && (
                  <div className="flex items-center gap-2">
                    <label htmlFor="repeatEveryDays" className={`text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Repeat every
                    </label>
                    <input
                      type="number"
                      id="repeatEveryDays"
                      value={repeatEveryDays}
                      onChange={(e) => setRepeatEveryDays(Math.max(1, parseInt(e.target.value)))}
                      min="1"
                      className={`w-20 px-2 py-1 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'border-gray-300 text-gray-900'
                      }`}
                    />
                    <span className={`text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>days</span>
                  </div>
                )}
              </div>

              <ImageUpload
                images={images}
                onImagesChange={setImages}
                disabled={isSubmitting}
              />
            </div>

            <div className={`flex justify-end gap-3 px-6 py-4 rounded-b-lg ${
              darkMode ? 'bg-gray-900' : 'bg-gray-50'
            }`}>
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  darkMode
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 focus:ring-offset-gray-900'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 ${
                  darkMode ? 'focus:ring-offset-gray-900' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Task
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};