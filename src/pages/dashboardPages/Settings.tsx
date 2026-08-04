import { useEffect, useState } from 'react';
import { fetchSuperuserMe, type SuperuserSession } from '@/lib/adminAuth';
import { getApiBase } from '@/lib/platformApi';

const SettingsManagement = ({ language }: { language: string }) => {
  const [me, setMe] = useState<SuperuserSession | null>(null);

  useEffect(() => {
    void fetchSuperuserMe().then(setMe).catch(() => setMe(null));
  }, []);

  const isAr = language === 'ar';

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold">
        {isAr ? 'الإعدادات' : 'Settings'}
      </h2>

      <div className="bg-white rounded-xl border p-5 shadow-sm space-y-3">
        <h3 className="font-semibold">
          {isAr ? 'جلسة المشغّل' : 'Operator session'}
        </h3>
        <dl className="text-sm space-y-2">
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">Email</dt>
            <dd className="font-medium">{me?.email || '—'}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">Role</dt>
            <dd className="font-medium">{me?.role || '—'}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">API</dt>
            <dd className="font-mono text-xs">{getApiBase()}</dd>
          </div>
        </dl>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-900">
        {isAr
          ? 'إدارة المستخدمين والإعدادات المتقدمة ستُبنى لاحقاً على نفس واجهة qafila-platform.'
          : 'User management and deeper settings will be added next — still against the same qafila-platform API.'}
      </div>
    </div>
  );
};

export default SettingsManagement;
