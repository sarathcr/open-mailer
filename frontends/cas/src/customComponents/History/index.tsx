import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HistoryUser } from '@/modules/user/gql/types/history';
import { getUserAvatarURL } from '@/utils/profileUrl';
import { FC } from 'react';

export const History: FC<HistoryUser> = ({ histories }) => {
  return (
    <>
      <div className="mt-20">
        {histories?.map((history, index) => (
          <>
            <div key={index} className="mt-10 flex items-center gap-2.5">
              <Avatar className="rounded-md">
                <AvatarImage
                  src={getUserAvatarURL(history.changedByName)}
                  width={70}
                  height={70}
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="flex flex-col justify-between">
                <p>
                  {history.changeType === 'CREATE'
                    ? 'Created'
                    : history.changeType === 'DELETE'
                      ? 'Deleted'
                      : 'Updated'}{' '}
                  by {history.changedByName} on{' '}
                  {new Date(history.changedAt).toLocaleString()}
                </p>
              </span>
            </div>
            <ul className="ms-20 mt-4">
              {history.changeType !== 'CREATE' &&
                history.changeType !== 'DELETE' && (
                  <li className="list-disc">
                    {history.changes.map((change, index: number) => (
                      <ul key={index} className="list-disc">
                        {change.fieldName !== 'createdAt' &&
                          change.fieldName !== 'updatedAt' && (
                            <li>
                              <b>{change.fieldName}</b> changed from{' '}
                              <i>{change.oldValue}</i> to{' '}
                              <i>{change.newValue}</i>
                            </li>
                          )}
                      </ul>
                    ))}
                  </li>
                )}
            </ul>
          </>
        ))}
      </div>
    </>
  );
};
