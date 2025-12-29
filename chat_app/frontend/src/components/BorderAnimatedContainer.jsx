function BorderAnimatedContainer({ children }) { // define a functional container component to wrap content with an animated gradient border effect
    return (
        <div className="w-full h-full [background:linear-gradient(45deg,#172033,--theme(--color-slate-800)_50%,#172033)_padding-box,conic-gradient(from_var(--border-angle),--theme(--color-slate-600/.48)_80%,--theme(--color-cyan-500)_86%,--theme(--color-cyan-300)_90%,--theme(--color-cyan-500)_94%,--theme(--color-slate-600/.48))_border-box] rounded-2xl border border-transparent animate-border flex overflow-hidden">
            {children} {/* render any nested child components or elements passed into this container */}
        </div>
    );
}

export default BorderAnimatedContainer;