import React from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // Make sure Navigate is included in the import
import Home from "../Home";
import UserProfile from "../profile/UserProfile";
import UpdateProfileForm from "../profile/UpdateProfileForm";
import LoginForm from "../auth/LoginForm";
import SignupForm from "../auth/SignupForm";
import ComposerList from "../composers/ComposerList";
import ComposerDetail from "../composers/ComposerDetail";
import ComposerForm from "../composers/ComposerForm";
import CompositionList from "../compositions/CompositionList";
import CompositionDetail from "../compositions/CompositionDetail";
import CompositionForm from "../compositions/CompositionForm";
import ComposerSelection from "../composers/ComposerSelection";
// import UserInteractionsList from "../userInteractions/UserInteractionsList";
// import UserInteractionForm from "../userInteractions/UserInteractionForm";


import { useUserContext } from '../auth/UserContext'; 

function CustomRoutes() {
  const { user } = useUserContext();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/composers" element={<ComposerList />} />
      <Route path="/composers/new" element={<ComposerForm />} />
      <Route path="/composers/:composerId" element={<ComposerDetail />} />
      <Route path="/composers/:composerId/edit" element={<ComposerForm />} />
      <Route path="/compositions" element={<CompositionList />} />
      {/* <Route path="/compositions/new" element={<CompositionForm />} /> */}
      <Route path="/compositions/:compositionId" element={<CompositionDetail />} />
      <Route path="/compositions/:compositionId/edit" element={<CompositionForm />} />
      <Route path="/composers/:composerId/compositions/new" element={<CompositionForm />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/profile/edit" element={<UpdateProfileForm />} />
      <Route path="/select-composer" element={<ComposerSelection />} />
      {/* <Route path="/user-interactions" element={<UserInteractionsList />} /> 
       <Route path="/user-interactions/new" element={<UserInteractionForm />} />
      <Route path="/user-interactions/:interactionId/edit" element={<UserInteractionForm />} /> */}
    </Routes>
  );
}

export default CustomRoutes;
