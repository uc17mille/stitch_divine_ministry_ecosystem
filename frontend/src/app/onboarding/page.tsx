'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Heart, Sparkles, BookOpen, Church, ShieldCheck, 
  Target, ArrowRight, ArrowLeft, Send, CheckCircle2, AlertCircle, FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useAuthStore } from '@/store/authStore';
import { usersApi } from '@/lib/api';

const ALL_STEPS = [
  { id: 1, name: 'Personal Details', icon: User, desc: 'Your identity and contact info' },
  { id: 2, name: 'Family details', icon: Heart, desc: 'Marital status & family structure' },
  { id: 3, name: 'Spiritual Journey', icon: Sparkles, desc: 'Salvation, testimony & calling' },
  { id: 4, name: 'Education', icon: BookOpen, desc: 'Educational & certifications history' },
  { id: 5, name: 'Ministry Info', icon: Church, desc: 'Current ministry role & vision' },
  { id: 6, name: 'Spiritual Heritage', icon: ShieldCheck, desc: 'Past alignment & oversight' },
  { id: 7, name: 'Vision & Growth', icon: Target, desc: 'Your expectations & goals' },
  { id: 8, name: 'Training Package', icon: FileText, desc: 'Choose training pathway' },
  { id: 9, name: 'Fatherhood App', icon: ShieldCheck, desc: 'Fatherhood details' },
  { id: 10, name: 'Covenant Declaration', icon: CheckCircle2, desc: 'Commitment & declaration' }
];

export default function OnboardingPage() {
  const isAuthenticated = useRequireAuth();
  const { logout } = useAuthStore();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBenefits, setShowBenefits] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Core application state
  const [formData, setFormData] = useState({
    // Section 1: Personal Details
    fullName: '',
    preferredName: '',
    gender: '',
    dob: '',
    nationality: '',
    birthCountry: '',
    originState: '',
    originLga: '',
    residenceCountry: '',
    residenceState: '',
    residenceCity: '',
    residenceLga: '',
    residenceAddress: '',
    mobileNumber: '',
    whatsAppNumber: '',
    emailAddress: '',
    socialMedia: '',

    // Section 2: Family Information
    maritalStatus: '',
    spouseName: '',
    weddingDate: '',
    weddingLocation: '',
    numChildren: 0,
    childrenDetails: '',

    // Section 3: Salvation & Journey
    salvationDate: '',
    salvationTestimony: '',
    ministryCallDate: '',
    ministryJourney: '',

    // Section 4: Education
    highestQualification: '',
    institutionAttended: '',
    fieldOfStudy: '',
    certifications: '',

    // Section 5: Ministry Information
    ministryName: '',
    ministryWebsite: '',
    ministryCountry: '',
    ministryState: '',
    ministryCity: '',
    ministryRole: '',
    ministryRoleOther: '',
    ministryStartYear: '',
    ministryAvgAttendance: '',
    ministryBranches: 0,
    ministryFacility: '',
    ministryVision: '',
    ministryFocus: '',
    ministryStatus: '',
    biVocationalProfession: '',

    // Section 6: Spiritual Heritage
    heritageType: 'Senior Pastor', // 'Senior Pastor' or 'Committed Minister'
    formerMinistry: '',
    formerPastorName: '',
    formerServiceYears: '',
    formerResponsibilities: '',
    ordained: '',
    released: '',
    releasedExplanation: '',
    underSpiritualOversight: '',
    oversightDetails: '',
    requestOversightFromDubus: '',
    activePastorName: '',
    activeMinistryName: '',
    activeServiceYears: '',
    activeResponsibilities: '',

    // Section 7: Vision & Growth
    goals12Months: '',
    greatestChallenge: '',
    whySeekingCovering: '',
    expectedFromMentorship: '',
    growthAreas: '',

    // Section 8: Training Package & Spiritual Fatherhood
    trainingPackage: '', // 'Mentorship' or 'Spiritual Fatherhood'
    
    // Step 9: Fatherhood Application
    fatherhoodReason: '',
    fatherhoodUnderstanding: '',
    fatherhoodGodAsking: '',
    fatherhoodExpectations: '',
    fatherhoodCurrentFather: '', // 'Yes' or 'No'
    fatherhoodCurrentFatherExplain: '',
    fatherhoodLeaderDiscussed: '', // 'Yes' or 'No'
    fatherhoodLeaderDiscussedExplain: '',
    
    // Step 10: Covenant commitment & Declaration
    fatherhoodCorrection: '', // 'Yes' or 'No'
    fatherhoodAccountability: '', // 'Yes' or 'No'
    fatherhoodProtectUnity: '', // 'Yes' or 'No'
    fatherhoodSupportVision: '', // 'Yes' or 'No'
    fatherhoodStewardship: '', // 'Yes' or 'No'
    fatherhoodSignature: '',
    fatherhoodDate: ''
  });

  // Load saved progress from localStorage
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('lumora_mentorship_application');
    if (saved) {
      try {
        setFormData(prev => ({ ...prev, ...JSON.parse(saved) }));
      } catch (e) {
        console.error('Error parsing cached application draft:', e);
      }
    }
  }, []);

  // Autosave progress to localStorage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('lumora_mentorship_application', JSON.stringify(formData));
    }
  }, [formData, isMounted]);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Perform validation on fields for active step
  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return (
          formData.fullName.trim().length > 0 &&
          formData.preferredName.trim().length > 0 &&
          formData.gender !== '' &&
          formData.dob !== '' &&
          formData.nationality.trim().length > 0 &&
          formData.birthCountry.trim().length > 0 &&
          formData.originState.trim().length > 0 &&
          formData.originLga.trim().length > 0 &&
          formData.residenceCountry.trim().length > 0 &&
          formData.residenceState.trim().length > 0 &&
          formData.residenceCity.trim().length > 0 &&
          formData.residenceLga.trim().length > 0 &&
          formData.residenceAddress.trim().length > 0 &&
          formData.mobileNumber.trim().length > 0 &&
          formData.whatsAppNumber.trim().length > 0 &&
          formData.emailAddress.trim().length > 0 &&
          formData.socialMedia.trim().length > 0
        );
      case 2:
        if (formData.maritalStatus === '') return false;
        if (formData.maritalStatus === 'Married') {
          if (formData.spouseName.trim().length === 0 || formData.weddingDate === '' || formData.weddingLocation.trim().length === 0) {
            return false;
          }
        }
        if (formData.numChildren > 0 && formData.childrenDetails.trim().length === 0) {
          return false;
        }
        return true;
      case 3:
        return (
          formData.salvationDate.trim().length > 0 &&
          formData.salvationTestimony.trim().length > 10 &&
          formData.ministryCallDate.trim().length > 0 &&
          formData.ministryJourney.trim().length > 10
        );
      case 4:
        return (
          formData.highestQualification.trim().length > 0 &&
          formData.institutionAttended.trim().length > 0 &&
          formData.fieldOfStudy.trim().length > 0
        );
      case 5:
        if (
          formData.ministryName.trim().length === 0 ||
          formData.ministryCountry.trim().length === 0 ||
          formData.ministryState.trim().length === 0 ||
          formData.ministryCity.trim().length === 0 ||
          formData.ministryRole === '' ||
          formData.ministryStartYear.trim().length === 0 ||
          formData.ministryAvgAttendance.trim().length === 0 ||
          formData.ministryFacility === '' ||
          formData.ministryVision.trim().length < 10 ||
          formData.ministryFocus.trim().length === 0 ||
          formData.ministryStatus === ''
        ) {
          return false;
        }
        if (formData.ministryRole === 'Other' && formData.ministryRoleOther.trim().length === 0) {
          return false;
        }
        if (formData.ministryStatus === 'Bi-vocational' && formData.biVocationalProfession.trim().length === 0) {
          return false;
        }
        return true;
      case 6:
        if (formData.heritageType === 'Senior Pastor') {
          if (
            formData.formerMinistry.trim().length === 0 ||
            formData.formerPastorName.trim().length === 0 ||
            formData.formerServiceYears.trim().length === 0 ||
            formData.formerResponsibilities.trim().length === 0 ||
            formData.ordained === '' ||
            formData.released === '' ||
            formData.underSpiritualOversight === ''
          ) {
            return false;
          }
          if (formData.released === 'Yes' && formData.releasedExplanation.trim().length === 0) {
            return false;
          }
          if (formData.underSpiritualOversight === 'Yes' && formData.oversightDetails.trim().length === 0) {
            return false;
          }
          if (formData.underSpiritualOversight === 'No' && formData.requestOversightFromDubus === '') {
            return false;
          }
          return true;
        } else {
          return (
            formData.activePastorName.trim().length > 0 &&
            formData.activeMinistryName.trim().length > 0 &&
            formData.activeServiceYears.trim().length > 0 &&
            formData.activeResponsibilities.trim().length > 0
          );
        }
      case 7:
        return (
          formData.goals12Months.trim().length > 10 &&
          formData.greatestChallenge.trim().length > 10 &&
          formData.whySeekingCovering.trim().length > 10 &&
          formData.expectedFromMentorship.trim().length > 10 &&
          formData.growthAreas.trim().length > 10
        );
      case 8:
        return formData.trainingPackage !== '';
      case 9:
        if (formData.trainingPackage === 'Mentorship') return true;
        if (
          formData.fatherhoodReason.trim().length === 0 ||
          formData.fatherhoodUnderstanding.trim().length === 0 ||
          formData.fatherhoodGodAsking.trim().length === 0 ||
          formData.fatherhoodExpectations.trim().length === 0 ||
          formData.fatherhoodCurrentFather === '' ||
          formData.fatherhoodLeaderDiscussed === ''
        ) {
          return false;
        }
        if (formData.fatherhoodCurrentFather === 'Yes' && formData.fatherhoodCurrentFatherExplain.trim().length === 0) {
          return false;
        }
        if (formData.fatherhoodLeaderDiscussed === 'No' && formData.fatherhoodLeaderDiscussedExplain.trim().length === 0) {
          return false;
        }
        return true;
      case 10:
        if (formData.trainingPackage === 'Mentorship') return true;
        return (
          formData.fatherhoodCorrection !== '' &&
          formData.fatherhoodAccountability !== '' &&
          formData.fatherhoodProtectUnity !== '' &&
          formData.fatherhoodSupportVision !== '' &&
          formData.fatherhoodStewardship !== '' &&
          formData.fatherhoodSignature.trim().length > 0 &&
          formData.fatherhoodDate.trim().length > 0
        );
      default:
        return false;
    }
  };

  const getStepsList = () => {
    if (formData.trainingPackage === 'Mentorship') {
      return ALL_STEPS.slice(0, 8);
    }
    return ALL_STEPS;
  };

  const steps = getStepsList();
  const totalSteps = steps.length;

  // Clamp currentStep if package changes and clamps max step count
  useEffect(() => {
    const activeSteps = getStepsList();
    if (currentStep > activeSteps.length) {
      setCurrentStep(activeSteps.length);
    }
  }, [formData.trainingPackage]);

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      toast.error('Please fill all required fields in this section to continue.');
      return;
    }
    setCurrentStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) {
      toast.error('Please complete the final section before submitting.');
      return;
    }
    setShowBenefits(true);
  };

  const handleAcceptAndSubmit = async () => {
    setIsSubmitting(true);
    try {
      const onboardingData = await usersApi.submitOnboarding(formData);
      setIsSubmitting(false);
      localStorage.setItem('lumora_onboarding_completed', 'true');
      localStorage.removeItem('lumora_require_onboarding');
      
      // Update local auth store so layout knows onboarding is complete
      const { user, setUser } = useAuthStore.getState();
      if (user) {
        setUser({ ...user, onboardingDetails: onboardingData } as any);
      }

      toast.success('Application submitted successfully! 🎉');
      router.push('/dashboard');
    } catch (err: any) {
      setIsSubmitting(false);
      toast.error(err?.message || 'Failed to submit application. Please try again.');
    }
  };

  if (!isMounted || !isAuthenticated) return null;

  if (showBenefits) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden font-sans text-slate-800">
        {/* Decorative background glows */}
        <div className="absolute top-[-25%] left-[-20%] w-[80vw] h-[80vw] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-25%] right-[-20%] w-[80vw] h-[80vw] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />
        
        {/* Top light navbar */}
        <nav className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-bold text-sm text-white shadow-md">L</div>
            <span className="font-bold text-lg text-blue-950 tracking-wider">LUMORA</span>
          </div>
        </nav>

        {/* Benefits Container */}
        <div className="flex-1 w-full max-w-5xl mx-auto py-12 px-6 flex flex-col justify-center items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl p-8 md:p-12 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 mb-4 shadow-sm">
                <Sparkles size={14} className="text-emerald-600" />
                <span className="text-[10px] font-black tracking-widest text-emerald-800 uppercase">Application Submitted</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">Benefits for all registered members</h1>
              <p className="text-sm font-medium text-slate-500">Please review and accept the benefits and structural expectations for this mentorship family before proceeding to your dashboard.</p>
            </div>

            {/* Grid of Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              
              {/* Benefit 1 */}
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1.5 font-sans">Personal Access to Reverend Dubus Achufusi</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium font-sans">
                    Not unlimited access but Meaningful access. For example: By weekly Father&apos;s Address (Live address). Members&apos; commitment determines the quality of access that would be given. More committed members would have a one on one phone call short conversation at an agreed time Reverend Dubus would give.
                  </p>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-650 border border-indigo-100 flex items-center justify-center shrink-0">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1.5 font-sans">Q&amp;A Box</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium font-sans">
                    Members are allowed to ask questions in our Q&amp;A box and answers will be supplied. Also there&apos;ll be time for questions and answers during live broadcast.
                  </p>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
                  <Send size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1.5 font-sans">Access During Retreats &amp; Conventions</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium font-sans">
                    ACCESS TO REVEREND DUBUS DURING MINISTERS&apos; RETREATS AND CONVENTIONS FOR IMPARTATIONS.
                  </p>
                </div>
              </div>

              {/* Benefit 4 */}
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1.5 font-sans">Ministry Coaching &amp; Accountability</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium font-sans">
                    Ministry Coaching time with Reverend Dubus Achufusi: After every major ministry milestone, there should be coaching and review. Accountability Structure: The goal isn&apos;t surveillance; it&apos;s pastoral care. Keys to the supernatural.
                  </p>
                </div>
              </div>

              {/* Benefit 5 */}
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0">
                  <Heart size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1.5 font-sans">Family Circles</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium font-sans">
                    As the family builds us, mentors would be assigned to ministers of this family in their regions for no man can disciple a crowd.
                  </p>
                </div>
              </div>

              {/* Benefit 6 */}
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center shrink-0">
                  <Target size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1.5 font-sans">Conventions &amp; Kingdom Networks</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium font-sans">
                    Conventions in different regions where members of the family are domiciled for the purpose of impartations. Ministerial collaboration or Kingdom networks where ministers in this network would be invited to the churches of others.
                  </p>
                </div>
              </div>

            </div>

            <div className="pt-6 border-t border-slate-150 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setShowBenefits(false)}
                className="px-6 py-4 border border-slate-200 hover:bg-slate-50 rounded-2xl text-xs font-bold tracking-wider text-slate-600 transition-all flex items-center gap-2 uppercase font-sans"
              >
                <ArrowLeft size={14} /> Back to Application
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleAcceptAndSubmit}
                className="px-10 py-4 bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-500/20 font-bold text-sm tracking-wider rounded-2xl transition-all flex items-center gap-2 uppercase font-sans disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>Submitting... <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /></>
                ) : (
                  <>Accept &amp; Submit Application <Send size={16} /></>
                )}
              </button>
            </div>

          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden font-sans text-slate-800">
      
      {/* Decorative background glows */}
      <div className="absolute top-[-25%] left-[-20%] w-[80vw] h-[80vw] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-25%] right-[-20%] w-[80vw] h-[80vw] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />
      
      {/* Top light navbar */}
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-bold text-sm text-white shadow-md">L</div>
          <span className="font-bold text-lg text-blue-950 tracking-wider">LUMORA</span>
        </div>
        <button 
          onClick={() => {
            logout();
            router.push('/login');
          }}
          className="text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors uppercase tracking-wider font-sans"
        >
          Sign Out
        </button>
      </nav>

      {/* Main content split wizard container */}
      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col lg:flex-row py-10 px-6 gap-10">
        
        {/* Left Panel: App Welcome & Stepper Tracker */}
        <div className="w-full lg:w-[350px] shrink-0 space-y-8">
          
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl" />
            <div className="flex items-center gap-2 text-blue-600 mb-3">
              <ShieldCheck size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Mentorship Covering Application</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-blue-950 mb-2">Welcome to Lumora</h2>
            <p className="text-xs leading-relaxed text-slate-500 font-medium font-sans">
              The Reverend Dubus Achufusi Mentorship and Covenant relationship brand. Please complete each section thoughtfully and prayerfully.
            </p>
          </div>

          {/* Stepper Progress Steps List */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 hidden lg:block space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Application Steps</h3>
            <div className="space-y-4 relative">
              {steps.map((step) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;

                return (
                  <div key={step.id} className="flex items-start gap-3.5 group">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-all border ${
                      isActive 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10' 
                        : isCompleted 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-255' 
                        : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}>
                      {isCompleted ? <CheckCircle2 size={15} /> : step.id}
                    </div>
                    <div>
                      <h4 className={`text-xs font-black tracking-wide ${
                        isActive ? 'text-blue-600' : isCompleted ? 'text-emerald-600' : 'text-slate-500'
                      }`}>{step.name}</h4>
                      <p className="text-[10px] text-slate-400 font-medium font-sans">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Panel: Content Box Form Formats */}
        <div className="flex-1">
          <div className="bg-white border border-slate-200/80 rounded-[2rem] shadow-xl p-8 md:p-12 relative overflow-hidden">
            
            {/* Header Area */}
            <div className="border-b border-slate-100 pb-6 mb-8 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Section {currentStep} of {totalSteps}</span>
                <h1 className="text-2xl font-black text-blue-950 mt-1 tracking-tight">{steps[currentStep - 1]?.name}</h1>
              </div>
              <div className="text-xs font-bold text-slate-650 bg-slate-50 px-3 py-1.5 rounded-full font-mono border border-slate-150">
                {Math.round((currentStep / totalSteps) * 100)}% Complete
              </div>
            </div>

            <form onSubmit={handleSubmitApp} className="space-y-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  
                  {/* STEP 1: PERSONAL DETAILS */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      
                      <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-xs leading-relaxed text-slate-600 mb-6 font-sans">
                        Please provide your full legal name and details. Fields marked with <span className="text-rose-500">*</span> are mandatory for covenant recording.
                      </div>

                      <h3 className="text-xs font-bold text-blue-900 border-b border-slate-100 pb-2 mb-4 uppercase tracking-wider">Personal Details</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">Full Name <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            required
                            value={formData.fullName}
                            onChange={e => updateField('fullName', e.target.value)}
                            placeholder="Apostle John Doe" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">Preferred Name <span className="text-rose-500">*</span></label>
                          <input 
                            type="text"
                            required
                            value={formData.preferredName}
                            onChange={e => updateField('preferredName', e.target.value)}
                            placeholder="Apostle John" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">Gender <span className="text-rose-500">*</span></label>
                          <select
                            required
                            value={formData.gender}
                            onChange={e => updateField('gender', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                          >
                            <option value="">Select gender...</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">Date of Birth <span className="text-rose-500">*</span></label>
                          <input 
                            type="date" 
                            required
                            value={formData.dob}
                            onChange={e => updateField('dob', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">Nationality <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            required
                            value={formData.nationality}
                            onChange={e => updateField('nationality', e.target.value)}
                            placeholder="Nigerian" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">Country of Birth <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            required
                            value={formData.birthCountry}
                            onChange={e => updateField('birthCountry', e.target.value)}
                            placeholder="Nigeria" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">State/Province/Region of Origin <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            required
                            value={formData.originState}
                            onChange={e => updateField('originState', e.target.value)}
                            placeholder="Anambra State" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">Local Government Area / Municipality <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            required
                            value={formData.originLga}
                            onChange={e => updateField('originLga', e.target.value)}
                            placeholder="Idemili South" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                          />
                        </div>
                      </div>

                      <h3 className="text-xs font-bold text-blue-900 border-b border-slate-100 pb-2 mt-8 mb-4 uppercase tracking-wider">Current Residence</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">Country of Residence <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            required
                            value={formData.residenceCountry}
                            onChange={e => updateField('residenceCountry', e.target.value)}
                            placeholder="Nigeria" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">State/Province/Region <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            required
                            value={formData.residenceState}
                            onChange={e => updateField('residenceState', e.target.value)}
                            placeholder="Lagos State" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">City <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            required
                            value={formData.residenceCity}
                            onChange={e => updateField('residenceCity', e.target.value)}
                            placeholder="Ikeja" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">Local Government Area / Municipality <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            required
                            value={formData.residenceLga}
                            onChange={e => updateField('residenceLga', e.target.value)}
                            placeholder="Ikeja LGA" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                          />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                          <label className="block text-xs font-bold text-slate-600">Residential Address <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            required
                            value={formData.residenceAddress}
                            onChange={e => updateField('residenceAddress', e.target.value)}
                            placeholder="12, Sanctuary Avenue, Off Salvation Way" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                          />
                        </div>
                      </div>

                      <h3 className="text-xs font-bold text-blue-900 border-b border-slate-100 pb-2 mt-8 mb-4 uppercase tracking-wider">Contact Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">Mobile Number (with country code) <span className="text-rose-500">*</span></label>
                          <input 
                            type="tel" 
                            required
                            value={formData.mobileNumber}
                            onChange={e => updateField('mobileNumber', e.target.value)}
                            placeholder="+234 803 123 4567" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-mono text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">WhatsApp Number <span className="text-rose-500">*</span></label>
                          <input 
                            type="tel" 
                            required
                            value={formData.whatsAppNumber}
                            onChange={e => updateField('whatsAppNumber', e.target.value)}
                            placeholder="+234 803 123 4567" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-mono text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">Email Address <span className="text-rose-500">*</span></label>
                          <input 
                            type="email" 
                            required
                            value={formData.emailAddress}
                            onChange={e => updateField('emailAddress', e.target.value)}
                            placeholder="pastor@church.org" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">Social Media Page <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            required
                            value={formData.socialMedia}
                            onChange={e => updateField('socialMedia', e.target.value)}
                            placeholder="facebook.com/pastorjohn" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                          />
                        </div>
                      </div>

                    </div>
                  )}

                  {/* STEP 2: FAMILY INFORMATION */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <h3 className="text-xs font-bold text-blue-900 border-b border-slate-100 pb-2 mb-4 uppercase tracking-wider">Marital Details</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">Marital Status <span className="text-rose-500">*</span></label>
                          <select
                            required
                            value={formData.maritalStatus}
                            onChange={e => updateField('maritalStatus', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                          >
                            <option value="">Select status...</option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Widowed">Widowed</option>
                            <option value="Divorced">Divorced</option>
                          </select>
                        </div>
                      </div>

                      {formData.maritalStatus === 'Married' && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100"
                        >
                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-600">{"Spouse's Full Name"} <span className="text-rose-500">*</span></label>
                            <input 
                              type="text"
                              required
                              value={formData.spouseName}
                              onChange={e => updateField('spouseName', e.target.value)}
                              placeholder="Spouse Name" 
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-600">Wedding Date <span className="text-rose-500">*</span></label>
                            <input 
                              type="date" 
                              required
                              value={formData.weddingDate}
                              onChange={e => updateField('weddingDate', e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                            />
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <label className="block text-xs font-bold text-slate-600">Wedding Location <span className="text-rose-500">*</span></label>
                            <input 
                              type="text" 
                              required={formData.maritalStatus === 'Married'}
                              value={formData.weddingLocation}
                              onChange={e => updateField('weddingLocation', e.target.value)}
                              placeholder="City, Country" 
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                            />
                          </div>
                        </motion.div>
                      )}

                      <h3 className="text-xs font-bold text-blue-900 border-b border-slate-100 pb-2 mt-8 mb-4 uppercase tracking-wider">Children Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">Number of Children <span className="text-rose-500">*</span></label>
                          <input 
                            type="number" 
                            required
                            min="0"
                            value={formData.numChildren}
                            onChange={e => updateField('numChildren', parseInt(e.target.value) || 0)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                          />
                        </div>

                        {formData.numChildren > 0 && (
                          <div className="md:col-span-2 space-y-2">
                            <label className="block text-xs font-bold text-slate-600">{"Children's Names, Ages, and Gender"} <span className="text-rose-500">*</span></label>
                            <textarea 
                              rows={4}
                              required={formData.numChildren > 0}
                              value={formData.childrenDetails}
                              onChange={e => updateField('childrenDetails', e.target.value)}
                              placeholder="e.g. 1. Samuel Doe, 5 years, Male&#10;2. Hannah Doe, 3 years, Female" 
                              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm resize-none"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* STEP 3: SALVATION & SPIRITUAL JOURNEY */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-xs leading-relaxed text-slate-600 mb-6 font-sans">
                        This section is very important because it tells your spiritual story and highlights key postulations of your journey.
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">When did you give your life to Christ? <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            required
                            value={formData.salvationDate}
                            onChange={e => updateField('salvationDate', e.target.value)}
                            placeholder="e.g. October 1998, at a youth camp meeting" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">Briefly share your salvation testimony <span className="text-rose-500">*</span></label>
                          <textarea 
                            rows={4}
                            required
                            value={formData.salvationTestimony}
                            onChange={e => updateField('salvationTestimony', e.target.value)}
                            placeholder="Briefly describe your encounter with Christ..." 
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm resize-none"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">When did you discover your call to ministry? <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            required
                            value={formData.ministryCallDate}
                            onChange={e => updateField('ministryCallDate', e.target.value)}
                            placeholder="e.g. Year 2005 during university fellowship" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">Briefly describe your ministry journey <span className="text-rose-500">*</span></label>
                          <textarea 
                            rows={4}
                            required
                            value={formData.ministryJourney}
                            onChange={e => updateField('ministryJourney', e.target.value)}
                            placeholder="Describe how you started ministering, ordinations, and key stages of growth..." 
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: EDUCATIONAL BACKGROUND */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">Highest Educational Qualification <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            required
                            value={formData.highestQualification}
                            onChange={e => updateField('highestQualification', e.target.value)}
                            placeholder="e.g. Bachelor of Science, PhD" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">Institution Attended <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            required
                            value={formData.institutionAttended}
                            onChange={e => updateField('institutionAttended', e.target.value)}
                            placeholder="University of Lagos" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">Field of Study <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            required
                            value={formData.fieldOfStudy}
                            onChange={e => updateField('fieldOfStudy', e.target.value)}
                            placeholder="e.g. Business Administration, Theology" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">Professional Certifications (Optional)</label>
                          <input 
                            type="text" 
                            value={formData.certifications}
                            onChange={e => updateField('certifications', e.target.value)}
                            placeholder="e.g. PMP, ICAN" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 5: MINISTRY INFORMATION */}
                  {currentStep === 5 && (
                    <div className="space-y-6">
                      
                      <h3 className="text-xs font-bold text-blue-900 border-b border-slate-100 pb-2 mb-4 uppercase tracking-wider">Current Ministry</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">Name of Ministry / Church <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            required
                            value={formData.ministryName}
                            onChange={e => updateField('ministryName', e.target.value)}
                            placeholder="e.g. GloryPlus International" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">Ministry Website (Optional)</label>
                          <input 
                            type="text" 
                            value={formData.ministryWebsite}
                            onChange={e => updateField('ministryWebsite', e.target.value)}
                            placeholder="www.gloryplus.org" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">Country <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            required
                            value={formData.ministryCountry}
                            onChange={e => updateField('ministryCountry', e.target.value)}
                            placeholder="Nigeria" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">State/Province <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            required
                            value={formData.ministryState}
                            onChange={e => updateField('ministryState', e.target.value)}
                            placeholder="Lagos State" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">City <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            required
                            value={formData.ministryCity}
                            onChange={e => updateField('ministryCity', e.target.value)}
                            placeholder="Lekki" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                          />
                        </div>
                      </div>

                      <h3 className="text-xs font-bold text-blue-900 border-b border-slate-100 pb-2 mt-8 mb-4 uppercase tracking-wider">Ministry Role</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                          'Senior Pastor', 'Associate Pastor', 'Assistant Pastor',
                          'Evangelist', 'Prophet', 'Apostle', 'Teacher',
                          'Missionary', 'Church Planter', 'Worship Leader',
                          'Ministry Worker', 'Other'
                        ].map((role) => (
                          <button
                            key={role}
                            type="button"
                            onClick={() => updateField('ministryRole', role)}
                            className={`p-3 text-xs font-bold rounded-xl border text-left transition-all ${
                              formData.ministryRole === role
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100/80'
                            }`}
                          >
                            {role}
                          </button>
                        ))}
                      </div>

                      {formData.ministryRole === 'Other' && (
                        <div className="space-y-2 pt-2">
                          <label className="block text-xs font-bold text-slate-600">Please specify your role <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            required
                            value={formData.ministryRoleOther}
                            onChange={e => updateField('ministryRoleOther', e.target.value)}
                            placeholder="Specify role..." 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                          />
                        </div>
                      )}

                      <h3 className="text-xs font-bold text-blue-900 border-b border-slate-100 pb-2 mt-8 mb-4 uppercase tracking-wider">Ministry Overview</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">Year Ministry Started <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            required
                            value={formData.ministryStartYear}
                            onChange={e => updateField('ministryStartYear', e.target.value)}
                            placeholder="e.g. 2012" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">Average Attendance <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            required
                            value={formData.ministryAvgAttendance}
                            onChange={e => updateField('ministryAvgAttendance', e.target.value)}
                            placeholder="e.g. 150 members" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">Number of Branches <span className="text-rose-500">*</span></label>
                          <input 
                            type="number" 
                            min="0"
                            required
                            value={formData.ministryBranches}
                            onChange={e => updateField('ministryBranches', parseInt(e.target.value) || 0)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">Facility Type <span className="text-rose-500">*</span></label>
                          <select
                            required
                            value={formData.ministryFacility}
                            onChange={e => updateField('ministryFacility', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                          >
                            <option value="">Select facility...</option>
                            <option value="Owned Facility">Owned Facility</option>
                            <option value="Rented Facility">Rented Facility</option>
                            <option value="Home Fellowship">Home Fellowship</option>
                            <option value="Online Ministry">Online Ministry</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      <h3 className="text-xs font-bold text-blue-900 border-b border-slate-100 pb-2 mt-8 mb-4 uppercase tracking-wider">Vision, Focus & Status</h3>
                      
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">Ministry Vision <span className="text-rose-500">*</span></label>
                          <textarea 
                            rows={4}
                            required
                            value={formData.ministryVision}
                            onChange={e => updateField('ministryVision', e.target.value)}
                            placeholder="Please briefly describe the vision God has given you..." 
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm resize-none"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">Ministry Focus (Primary Assignment) <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            required
                            value={formData.ministryFocus}
                            onChange={e => updateField('ministryFocus', e.target.value)}
                            placeholder="e.g. Church Planting, Evangelism, Marketplace Ministry, Discipleship" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-600">Ministry Status <span className="text-rose-500">*</span></label>
                            <select
                              required
                              value={formData.ministryStatus}
                              onChange={e => updateField('ministryStatus', e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                            >
                              <option value="">Select status...</option>
                              <option value="Full-Time">Full-Time</option>
                              <option value="Bi-vocational">Bi-vocational</option>
                            </select>
                          </div>

                          {formData.ministryStatus === 'Bi-vocational' && (
                            <div className="space-y-2">
                              <label className="block text-xs font-bold text-slate-600">Describe your profession or business <span className="text-rose-500">*</span></label>
                              <input 
                                type="text" 
                                required
                                value={formData.biVocationalProfession}
                                onChange={e => updateField('biVocationalProfession', e.target.value)}
                                placeholder="Describe business/career details..." 
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 6: SPIRITUAL HERITAGE */}
                  {currentStep === 6 && (
                    <div className="space-y-6">
                      <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-xs leading-relaxed text-slate-600 mb-6 font-sans">
                        This section helps us understand your spiritual relationships. Please select which pathway describes you.
                      </div>

                      <div className="space-y-4">
                        <label className="block text-xs font-bold text-slate-600">Choose Pathway <span className="text-rose-500">*</span></label>
                        <div className="flex gap-4">
                          <button
                            type="button"
                            onClick={() => updateField('heritageType', 'Senior Pastor')}
                            className={`flex-1 p-4 rounded-xl border text-center transition-all ${
                              formData.heritageType === 'Senior Pastor'
                                ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-sm'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            Senior Pastor / Ministry Founder
                          </button>
                          <button
                            type="button"
                            onClick={() => updateField('heritageType', 'Committed Minister')}
                            className={`flex-1 p-4 rounded-xl border text-center transition-all ${
                              formData.heritageType === 'Committed Minister'
                                ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-sm'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            Active Church Minister / Member
                          </button>
                        </div>
                      </div>

                      {formData.heritageType === 'Senior Pastor' ? (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-6 pt-4 border-t border-slate-100"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="block text-xs font-bold text-slate-600">Which ministry did you serve under? <span className="text-rose-500">*</span></label>
                              <input 
                                type="text" 
                                required
                                value={formData.formerMinistry}
                                onChange={e => updateField('formerMinistry', e.target.value)}
                                placeholder="Ministry served under..." 
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="block text-xs font-bold text-slate-600">Name of former pastor / spiritual leader <span className="text-rose-500">*</span></label>
                              <input 
                                type="text" 
                                required
                                value={formData.formerPastorName}
                                onChange={e => updateField('formerPastorName', e.target.value)}
                                placeholder="Leader Name" 
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="block text-xs font-bold text-slate-600">How many years did you serve? <span className="text-rose-500">*</span></label>
                              <input 
                                type="text" 
                                required
                                value={formData.formerServiceYears}
                                onChange={e => updateField('formerServiceYears', e.target.value)}
                                placeholder="e.g. 5 years" 
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-600">What leadership responsibilities did you hold? <span className="text-rose-500">*</span></label>
                            <textarea 
                              rows={3}
                              required
                              value={formData.formerResponsibilities}
                              onChange={e => updateField('formerResponsibilities', e.target.value)}
                              placeholder="Briefly state your duties..." 
                              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm resize-none"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="block text-xs font-bold text-slate-600">Were you formally ordained or commissioned? <span className="text-rose-500">*</span></label>
                              <select
                                required
                                value={formData.ordained}
                                onChange={e => updateField('ordained', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                              >
                                <option value="">Select...</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                              </select>
                            </div>

                            <div className="space-y-2">
                              <label className="block text-xs font-bold text-slate-600">Were you officially released to begin your present assignment? <span className="text-rose-500">*</span></label>
                              <select
                                required
                                value={formData.released}
                                onChange={e => updateField('released', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                              >
                                <option value="">Select...</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                              </select>
                            </div>

                            {formData.released === 'Yes' && (
                              <div className="md:col-span-2 space-y-2">
                                <label className="block text-xs font-bold text-slate-600">Briefly explain the release process <span className="text-rose-500">*</span></label>
                                <textarea 
                                  rows={2}
                                  required
                                  value={formData.releasedExplanation}
                                  onChange={e => updateField('releasedExplanation', e.target.value)}
                                  placeholder="Describe how you were released..." 
                                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm resize-none"
                                />
                              </div>
                            )}

                            <div className="space-y-2">
                              <label className="block text-xs font-bold text-slate-600">Are you currently under spiritual oversight? <span className="text-rose-500">*</span></label>
                              <select
                                required
                                value={formData.underSpiritualOversight}
                                onChange={e => updateField('underSpiritualOversight', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                              >
                                <option value="">Select...</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                              </select>
                            </div>

                            {formData.underSpiritualOversight === 'Yes' && (
                              <div className="md:col-span-2 space-y-2">
                                <label className="block text-xs font-bold text-slate-600">Please provide oversight details <span className="text-rose-500">*</span></label>
                                <textarea 
                                  rows={2}
                                  required
                                  value={formData.oversightDetails}
                                  onChange={e => updateField('oversightDetails', e.target.value)}
                                  placeholder="Name of overseer or council details..." 
                                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm resize-none"
                                />
                              </div>
                            )}

                            {formData.underSpiritualOversight === 'No' && (
                              <div className="space-y-2">
                                <label className="block text-xs font-bold text-slate-600">Would you want to be under my spiritual oversight? <span className="text-rose-500">*</span></label>
                                <select
                                  required
                                  value={formData.requestOversightFromDubus}
                                  onChange={e => updateField('requestOversightFromDubus', e.target.value)}
                                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                                >
                                  <option value="">Select...</option>
                                  <option value="Yes">Yes</option>
                                  <option value="No">No</option>
                                </select>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-6 pt-4 border-t border-slate-100"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="block text-xs font-bold text-slate-600">Name of your pastor or spiritual leader <span className="text-rose-500">*</span></label>
                              <input 
                                type="text" 
                                required
                                value={formData.activePastorName}
                                onChange={e => updateField('activePastorName', e.target.value)}
                                placeholder="Pastor Name" 
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="block text-xs font-bold text-slate-600">Which ministry/church are you serving under? <span className="text-rose-500">*</span></label>
                              <input 
                                type="text" 
                                required
                                value={formData.activeMinistryName}
                                onChange={e => updateField('activeMinistryName', e.target.value)}
                                placeholder="e.g. City of God Assembly" 
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="block text-xs font-bold text-slate-600">How many years have you been serving? <span className="text-rose-500">*</span></label>
                              <input 
                                type="text" 
                                required
                                value={formData.activeServiceYears}
                                onChange={e => updateField('activeServiceYears', e.target.value)}
                                placeholder="e.g. 3 years" 
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-600">What leadership responsibilities do you hold in your church? <span className="text-rose-500">*</span></label>
                            <textarea 
                              rows={4}
                              required
                              value={formData.activeResponsibilities}
                              onChange={e => updateField('activeResponsibilities', e.target.value)}
                              placeholder="Describe your active service roles or department leadership..." 
                              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm resize-none"
                            />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* STEP 7: VISION & GROWTH */}
                  {currentStep === 7 && (
                    <div className="space-y-6">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">What are your ministry goals over the next 12 months? <span className="text-rose-500">*</span></label>
                          <textarea 
                            rows={3}
                            required
                            value={formData.goals12Months}
                            onChange={e => updateField('goals12Months', e.target.value)}
                            placeholder="Share your short term targets..." 
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm resize-none"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">What do you believe is your greatest challenge in ministry today? <span className="text-rose-500">*</span></label>
                          <textarea 
                            rows={3}
                            required
                            value={formData.greatestChallenge}
                            onChange={e => updateField('greatestChallenge', e.target.value)}
                            placeholder="Spiritual, operational, leadership alignment challenges..." 
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm resize-none"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">Why are you seeking spiritual covering or mentorship from Rev. Dubus Achufusi? <span className="text-rose-500">*</span></label>
                          <textarea 
                            rows={3}
                            required
                            value={formData.whySeekingCovering}
                            onChange={e => updateField('whySeekingCovering', e.target.value)}
                            placeholder="Briefly state your spiritual pull or alignment reasons..." 
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm resize-none"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">What do you hope to receive through this mentorship? <span className="text-rose-500">*</span></label>
                          <textarea 
                            rows={3}
                            required
                            value={formData.expectedFromMentorship}
                            onChange={e => updateField('expectedFromMentorship', e.target.value)}
                            placeholder="Guidance, prayers, accountability, alignment..." 
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm resize-none"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">In what areas do you most desire growth? <span className="text-rose-500">*</span></label>
                          <textarea 
                            rows={3}
                            required
                            value={formData.growthAreas}
                            onChange={e => updateField('growthAreas', e.target.value)}
                            placeholder="Spiritual alignment, church planting, structure, prophetic clarity..." 
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 8: TRAINING PACKAGE SELECTION */}
                  {currentStep === 8 && (
                    <div className="space-y-6">
                      <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-xs leading-relaxed text-slate-650 mb-6 font-sans">
                        Lumora offers two distinct pathways for ministerial training and relationship. Please select the package that aligns with your current desire.
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div 
                          onClick={() => updateField('trainingPackage', 'Mentorship')}
                          className={`cursor-pointer rounded-2xl border p-6 transition-all hover:shadow-md flex flex-col justify-between ${
                            formData.trainingPackage === 'Mentorship'
                              ? 'bg-blue-50/20 border-blue-600 shadow-md ring-1 ring-blue-600'
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          <div>
                            <div className="flex justify-between items-start mb-4">
                              <span className="text-[10px] font-black bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full uppercase tracking-wider">Mentorship</span>
                              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                formData.trainingPackage === 'Mentorship' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                              }`}>
                                {formData.trainingPackage === 'Mentorship' && <div className="w-2 h-2 bg-white rounded-full" />}
                              </div>
                            </div>
                            <h4 className="text-base font-bold text-blue-950 mb-2">Mentorship Package</h4>
                            <p className="text-xs text-slate-500 font-sans leading-relaxed mb-4">
                              For ministers who desire practical ministry training, leadership development, coaching, and community while remaining under their local church oversight.
                            </p>
                            <ul className="space-y-1.5 text-xs text-slate-600 font-sans list-disc list-inside">
                              <li>Practical ministry training</li>
                              <li>Holy Spirit impartation</li>
                              <li>Leadership development</li>
                              <li>Community & connection</li>
                              <li>Periodic coaching</li>
                            </ul>
                          </div>
                          <div className="pt-4 border-t border-slate-100/60 mt-4 text-[10px] text-slate-400 font-bold font-sans">
                            * Remain under current local church oversight.
                          </div>
                        </div>

                        <div 
                          onClick={() => updateField('trainingPackage', 'Spiritual Fatherhood')}
                          className={`cursor-pointer rounded-2xl border p-6 transition-all hover:shadow-md flex flex-col justify-between ${
                            formData.trainingPackage === 'Spiritual Fatherhood'
                              ? 'bg-blue-50/20 border-blue-600 shadow-md ring-1 ring-blue-600'
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          <div>
                            <div className="flex justify-between items-start mb-4">
                              <span className="text-[10px] font-black bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-full uppercase tracking-wider">Covenant Relationship</span>
                              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                formData.trainingPackage === 'Spiritual Fatherhood' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                              }`}>
                                {formData.trainingPackage === 'Spiritual Fatherhood' && <div className="w-2 h-2 bg-white rounded-full" />}
                              </div>
                            </div>
                            <h4 className="text-base font-bold text-blue-950 mb-2">Spiritual Fatherhood Package</h4>
                            <p className="text-xs text-slate-500 font-sans leading-relaxed mb-4">
                              For ministers seeking long-term covenant alignment, spiritual fatherhood covering, accountability, inheritance, and personal pastoral care.
                            </p>
                            <ul className="space-y-1.5 text-xs text-slate-600 font-sans list-disc list-inside">
                              <li>Spiritual covering & oversight</li>
                              <li>Long-term fatherhood</li>
                              <li>Accountability & guidance</li>
                              <li>Spiritual inheritance</li>
                              <li>Personal pastoral care & covenant</li>
                            </ul>
                          </div>
                          <div className="pt-4 border-t border-slate-100/60 mt-4 text-[10px] text-slate-400 font-bold font-sans">
                            * Requires an additional fatherhood application.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 9: FATHERHOOD APPLICATION */}
                  {currentStep === 9 && formData.trainingPackage === 'Spiritual Fatherhood' && (
                    <div className="space-y-6">
                      <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 text-xs leading-relaxed text-slate-605 mb-6 font-sans">
                        <h4 className="font-bold text-blue-900 mb-1.5 uppercase">Before You Continue</h4>
                        <p className="mb-2">Thank you for your interest in becoming part of the Father-Son covenant relationship.</p>
                        <p className="mb-2">Spiritual fatherhood is different from mentorship. Mentorship is designed to equip ministers in specific areas of Kingdom leadership and ministry while they remain under the care and oversight of their existing spiritual leaders.</p>
                        <p>Spiritual fatherhood, however, is a covenant relationship. It is a long-term commitment built on honor, trust, accountability, spiritual inheritance, mutual responsibility, and shared Kingdom purpose. Those who are received into spiritual fatherhood become part of my spiritual heritage and willingly embrace the values, culture, and responsibilities that accompany this relationship. For this reason, admission into spiritual fatherhood is prayerfully considered.</p>
                      </div>

                      <h3 className="text-xs font-bold text-blue-900 border-b border-slate-100 pb-2 mb-4 uppercase tracking-wider">Understanding of Spiritual Fatherhood</h3>

                      <div className="space-y-5">
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">Why are you seeking spiritual fatherhood rather than mentorship? <span className="text-rose-500">*</span></label>
                          <textarea 
                            rows={3}
                            required
                            value={formData.fatherhoodReason}
                            onChange={e => updateField('fatherhoodReason', e.target.value)}
                            placeholder="Describe your personal spiritual draw or guidance..." 
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm resize-none"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">Describe your understanding of biblical spiritual fatherhood <span className="text-rose-500">*</span></label>
                          <textarea 
                            rows={3}
                            required
                            value={formData.fatherhoodUnderstanding}
                            onChange={e => updateField('fatherhoodUnderstanding', e.target.value)}
                            placeholder="Describe what biblical spiritual fatherhood means to you..." 
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm resize-none"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">What do you believe God is asking of you through this covenant relationship? <span className="text-rose-500">*</span></label>
                          <textarea 
                            rows={3}
                            required
                            value={formData.fatherhoodGodAsking}
                            onChange={e => updateField('fatherhoodGodAsking', e.target.value)}
                            placeholder="What conviction do you believe God has placed in your heart?" 
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm resize-none"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">What expectations do you have of this relationship? <span className="text-rose-500">*</span></label>
                          <textarea 
                            rows={3}
                            required
                            value={formData.fatherhoodExpectations}
                            onChange={e => updateField('fatherhoodExpectations', e.target.value)}
                            placeholder="What support, mentorship, or alignment do you expect?" 
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm resize-none"
                          />
                        </div>
                      </div>

                      <h3 className="text-xs font-bold text-blue-900 border-b border-slate-100 pb-2 mt-8 mb-4 uppercase tracking-wider">Existing Spiritual Relationships</h3>

                      <div className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-600">Do you currently have a spiritual father? <span className="text-rose-500">*</span></label>
                            <select
                              required
                              value={formData.fatherhoodCurrentFather}
                              onChange={e => updateField('fatherhoodCurrentFather', e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                            >
                              <option value="">Select option...</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-600">Have you prayerfully discussed this with your current spiritual leader? <span className="text-rose-500">*</span></label>
                            <select
                              required
                              value={formData.fatherhoodLeaderDiscussed}
                              onChange={e => updateField('fatherhoodLeaderDiscussed', e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                            >
                              <option value="">Select option...</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          </div>
                        </div>

                        {formData.fatherhoodCurrentFather === 'Yes' && (
                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-600">Please explain why you are seeking spiritual fatherhood through Lumora <span className="text-rose-500">*</span></label>
                            <textarea 
                              rows={3}
                              required
                              value={formData.fatherhoodCurrentFatherExplain}
                              onChange={e => updateField('fatherhoodCurrentFatherExplain', e.target.value)}
                              placeholder="Please explain in detail..." 
                              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm resize-none"
                            />
                          </div>
                        )}

                        {formData.fatherhoodLeaderDiscussed === 'No' && (
                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-600">{"Please explain why you haven't discussed this decision"} <span className="text-rose-500">*</span></label>
                            <textarea 
                              rows={3}
                              required
                              value={formData.fatherhoodLeaderDiscussedExplain}
                              onChange={e => updateField('fatherhoodLeaderDiscussedExplain', e.target.value)}
                              placeholder="Please explain why..." 
                              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm resize-none"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* STEP 10: COVENANT & STEWARDSHIP COMMITMENT */}
                  {currentStep === 10 && formData.trainingPackage === 'Spiritual Fatherhood' && (
                    <div className="space-y-6">
                      <h3 className="text-xs font-bold text-blue-900 border-b border-slate-100 pb-2 mb-4 uppercase tracking-wider">Covenant Commitment</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">Are you willing to receive biblical correction? <span className="text-rose-500">*</span></label>
                          <select
                            required
                            value={formData.fatherhoodCorrection}
                            onChange={e => updateField('fatherhoodCorrection', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                          >
                            <option value="">Select...</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">Are you willing to live in accountability? <span className="text-rose-500">*</span></label>
                          <select
                            required
                            value={formData.fatherhoodAccountability}
                            onChange={e => updateField('fatherhoodAccountability', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                          >
                            <option value="">Select...</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">Are you willing to protect the unity of this family? <span className="text-rose-500">*</span></label>
                          <select
                            required
                            value={formData.fatherhoodProtectUnity}
                            onChange={e => updateField('fatherhoodProtectUnity', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                          >
                            <option value="">Select...</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">Are you willing to support this vision through prayer, participation, and faithful stewardship? <span className="text-rose-500">*</span></label>
                          <select
                            required
                            value={formData.fatherhoodSupportVision}
                            onChange={e => updateField('fatherhoodSupportVision', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                          >
                            <option value="">Select...</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>
                      </div>

                      <h3 className="text-xs font-bold text-blue-900 border-b border-slate-100 pb-2 mt-8 mb-4 uppercase tracking-wider">Stewardship Commitment</h3>

                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs leading-relaxed text-slate-655 mb-4 font-sans">
                        Those received into spiritual fatherhood become part of this family. As members of this covenant family, we believe in honoring God through faithful stewardship (tithes and offerings), including financial support according to biblical conviction and the established kingdom lifestyle.
                      </div>

                      <div className="space-y-2 max-w-md">
                        <label className="block text-xs font-bold text-slate-600">Do you understand and willingly embrace this commitment? <span className="text-rose-500">*</span></label>
                        <select
                          required
                          value={formData.fatherhoodStewardship}
                          onChange={e => updateField('fatherhoodStewardship', e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                        >
                          <option value="">Select...</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>

                      <h3 className="text-xs font-bold text-blue-900 border-b border-slate-100 pb-2 mt-8 mb-4 uppercase tracking-wider">Covenant Declaration</h3>

                      <div className="p-5 bg-indigo-50/40 rounded-2xl border border-indigo-100 text-xs italic leading-relaxed text-slate-700 font-sans shadow-sm">
                        “I understand that spiritual fatherhood is a lifelong covenant relationship rather than a temporary mentorship arrangement. If accepted into this family, I commit myself to honor, humility, accountability, faithfulness, unity, biblical stewardship, and the pursuit of God’s purpose as I grow under the spiritual leadership entrusted to Reverend Dubus Achufusi.”
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">Signature (Type Full Name) <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            required
                            value={formData.fatherhoodSignature}
                            onChange={e => updateField('fatherhoodSignature', e.target.value)}
                            placeholder="Type name as signature..." 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">Date <span className="text-rose-500">*</span></label>
                          <input 
                            type="date" 
                            required
                            value={formData.fatherhoodDate}
                            onChange={e => updateField('fatherhoodDate', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>

              {/* Wizard Control Navigation buttons */}
              <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                <div>
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-6 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold tracking-wider text-slate-600 transition-all flex items-center gap-2 uppercase"
                    >
                      <ArrowLeft size={14} /> Back
                    </button>
                  )}
                </div>
                
                <div>
                  {currentStep < totalSteps ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-8 py-3.5 bg-blue-600 text-white hover:bg-blue-700 font-bold text-xs tracking-wider rounded-xl transition-all shadow-md hover:shadow-blue-500/10 flex items-center gap-2 uppercase"
                    >
                      Next Section <ArrowRight size={14} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3.5 bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-xs tracking-wider rounded-xl transition-all shadow-md hover:shadow-emerald-500/10 flex items-center gap-2 uppercase disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>Submitting... <span className="animate-spin w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full" /></>
                      ) : (
                        <>Submit Application <Send size={14} /> </>
                      )}
                    </button>
                  )}
                </div>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
