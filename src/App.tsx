import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GlobalStyles, Container } from '@styles/index';
import { useUIStore } from '@stores/index';
import { Loading } from '@components/ui';
import { ErrorBoundary } from '@components/common/ErrorBoundary';
import { OnboardingRoutes } from '@screens/Onboarding';
import { HomeScreen } from '@screens/Home';
import { LearningRoutes } from '@screens/Learning';
import { GamesRoutes } from '@screens/Games';
import { ProgressRoutes } from '@screens/Progress';
import { ParentsRoutes } from '@screens/Parents';
import { Toast } from '@components/common/Toast';
import { Modal } from '@components/common/Modal';

function App() {
  const { loading, activeModal, toast } = useUIStore();

  if (loading) {
    return <Loading text="加载中..." overlay />;
  }

  return (
    <ErrorBoundary>
      <GlobalStyles />
      <Router>
        <Container className="safe-area-all">
          <Routes>
            {/* Onboarding Routes */}
            <Route path="/welcome/*" element={<OnboardingRoutes />} />

            {/* Main App Routes */}
            <Route path="/" element={<HomeScreen />} />
            <Route path="/learning/*" element={<LearningRoutes />} />
            <Route path="/games/*" element={<GamesRoutes />} />
            <Route path="/progress/*" element={<ProgressRoutes />} />
            <Route path="/parents/*" element={<ParentsRoutes />} />

            {/* Catch all route */}
            <Route path="*" element={<HomeScreen />} />
          </Routes>
        </Container>

        {/* Global Toast */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => useUIStore.getState().hideToast()}
          />
        )}

        {/* Global Modals */}
        {activeModal && (
          <Modal
            type={activeModal}
            onClose={() => useUIStore.getState().showModal(null)}
          />
        )}
      </Router>
    </ErrorBoundary>
  );
}

export default App;