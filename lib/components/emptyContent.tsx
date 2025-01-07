import React from 'react';
import {FileX} from 'lucide-react';

interface EmptyContentProps {
    title?: string;
    description?: string;
}

const EmptyContent: React.FC<EmptyContentProps> = ({
                                                       title = 'No Content Available',
                                                       description = 'There is nothing to display here at the moment.',
                                                   }) => {
    return (
        <div
            className="w-full flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
            <FileX className="w-12 h-12 text-gray-400 mb-4"/>
            <h3 className="text-xl font-semibold text-gray-700">{title}</h3>
            <p className="text-gray-500">{description}</p>
        </div>
    );
};

export default EmptyContent;
