'use client';

import { useGetMeQuery, useUpdateProfileMutation, useUpdateAvatarMutation, useUpdateCvMutation } from '@/store/api/usersApi';
import { useUploadImageMutation, useUploadPdfMutation } from '@/store/api/uploadApi';
import { User, MapPin, Mail, Globe, Pencil, Loader2, FileText, Plus, Camera, X } from 'lucide-react';
import { Link } from '@/routing';
import { useTranslations } from 'next-intl';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function ProfileClient() {
  const t = useTranslations('nav');
  const commonT = useTranslations('common');
  const authT = useTranslations('auth');
  const jobT = useTranslations('job');
  const profileT = useTranslations('profile');
  
  const { data: user, isLoading } = useGetMeQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [updateAvatar] = useUpdateAvatarMutation();
  const [updateCv] = useUpdateCvMutation();
  const [uploadImage, { isLoading: isUploadingAvatar }] = useUploadImageMutation();
  const [uploadPdf, { isLoading: isUploadingCv }] = useUploadPdfMutation();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    location: '',
    skills: [] as string[],
  });

  const onDropAvatar = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);
    
    try {
      const { url } = await uploadImage(formData).unwrap();
      await updateAvatar({ url }).unwrap();
    } catch (err) {
      console.error('Failed to upload avatar:', err);
    }
  }, [uploadImage, updateAvatar]);

  const onDropCv = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);
    
    try {
      const { url } = await uploadPdf(formData).unwrap();
      await updateCv({ url }).unwrap();
    } catch (err) {
      console.error('Failed to upload CV:', err);
    }
  }, [uploadPdf, updateCv]);

  const { getRootProps: getAvatarProps, getInputProps: getAvatarInput, isDragActive: isAvatarDragActive } = useDropzone({
    onDrop: onDropAvatar,
    accept: { 'image/*': [] },
    multiple: false,
    disabled: isUploadingAvatar
  });

  const { getRootProps: getCvProps, getInputProps: getCvInput, isDragActive: isCvDragActive } = useDropzone({
    onDrop: onDropCv,
    accept: { 'application/pdf': [] },
    multiple: false,
    disabled: isUploadingCv
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!user) return null;

  const handleEdit = () => {
    setFormData({
      firstName: user.profile?.firstName || '',
      lastName: user.profile?.lastName || '',
      bio: user.profile?.bio || '',
      location: user.profile?.location || '',
      skills: user.profile?.skills || [],
    });
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData).unwrap();
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-indigo-50/50 overflow-hidden">
        {/* Header/Cover Mock */}
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600" />
        
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="h-24 w-24 rounded-2xl bg-white p-1 shadow-lg group relative">
              <div 
                {...getAvatarProps()} 
                className={`h-full w-full rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 overflow-hidden cursor-pointer transition-all ${isAvatarDragActive ? 'ring-2 ring-indigo-600 ring-offset-2' : ''}`}
              >
                <input {...getAvatarInput()} />
                {isUploadingAvatar ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : user.profile?.avatar ? (
                  <>
                    <img src={user.profile.avatar} alt={user.profile.firstName} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                      <Camera className="h-8 w-8 text-white" />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <User className="h-10 w-10" />
                    <Camera className="h-4 w-4 absolute bottom-2 right-2 text-indigo-600 bg-white rounded-full p-0.5" />
                  </div>
                )}
              </div>
            </div>
            {!isEditing && (
              <button 
                onClick={handleEdit}
                className="flex items-center gap-2 bg-white border-2 border-gray-100 px-4 py-2 rounded-xl text-sm font-bold hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm"
              >
                <Pencil className="h-4 w-4" />
                {commonT('edit')}
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{authT('firstName')}</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{authT('lastName')}</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{commonT('location')}</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="e.g. Phnom Penh, Cambodia"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  {commonT('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
                  {commonT('save')}
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="space-y-1">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                  {user.profile?.firstName} {user.profile?.lastName}
                </h1>
                <p className="text-lg text-indigo-600 font-bold">{authT(user.role.toLowerCase() as any)}</p>
              </div>

              <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-500 font-medium">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{user.profile?.location || profileT('noLocation')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{user.email}</span>
                </div>
              </div>

              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-10 border-t pt-10">
                <div className="md:col-span-2 space-y-8">
                  <section>
                    <h2 className="text-xl font-black text-gray-900 mb-4 tracking-tight">{profileT('aboutMe')}</h2>
                    <p className="text-gray-600 leading-relaxed">
                      {user.profile?.bio || profileT('noBio')}
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-black text-gray-900 mb-4 tracking-tight">{profileT('skills')}</h2>
                    <div className="flex flex-wrap gap-2">
                      {user.profile?.skills && user.profile.skills.length > 0 ? (
                        user.profile.skills.map((skill) => (
                          <span key={skill} className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-sm font-bold border border-gray-100">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400 font-medium italic">{profileT('noSkills')}</p>
                      )}
                    </div>
                  </section>
                </div>

                <div className="space-y-8">
                  <section className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                    <h2 className="text-sm font-black text-indigo-900 uppercase tracking-widest mb-4">{profileT('resumeCv')}</h2>
                    {user.profile?.cvUrl ? (
                      <div className="space-y-3">
                        <div className="bg-white p-4 rounded-xl border border-indigo-100 flex items-center justify-between shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xs uppercase">
                              PDF
                            </div>
                            <div className="overflow-hidden">
                              <a href={user.profile.cvUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-gray-900 truncate block hover:text-indigo-600">
                                {profileT('viewCv')}
                              </a>
                              <p className="text-[10px] text-gray-400 uppercase font-black tracking-tighter">
                                {user.profile.updatedAt ? profileT('updated', { date: new Date(user.profile.updatedAt).toLocaleDateString() }) : ''}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div {...getCvProps()} className="cursor-pointer group">
                          <input {...getCvInput()} />
                          <button className="w-full py-2 border-2 border-dashed border-indigo-200 rounded-xl text-xs font-bold text-indigo-600 hover:border-indigo-400 hover:bg-white transition-all flex items-center justify-center gap-2">
                            {isUploadingCv ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                            {profileT('replaceCv')}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        {...getCvProps()} 
                        className={`bg-white p-4 rounded-xl border border-dashed border-indigo-200 flex flex-col items-center text-center cursor-pointer transition-all ${isCvDragActive ? 'border-indigo-600 bg-indigo-50' : 'hover:border-indigo-400'}`}
                      >
                        <input {...getCvInput()} />
                        {isUploadingCv ? (
                          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                        ) : (
                          <>
                            <FileText className="h-8 w-8 text-indigo-200 mb-2" />
                            <p className="text-xs text-gray-500 font-medium mb-3">{profileT('noCv')}</p>
                            <button className="flex items-center gap-1.5 text-xs font-bold text-indigo-600">
                              <Plus className="h-3 w-3" />
                              {profileT('uploadCv')}
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </section>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
