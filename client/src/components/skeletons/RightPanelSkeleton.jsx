const RightPanelSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 w-52 my-2">
      <div className="flex items-center gap-2">
        <div className="skeleton w-8 h-8 rounded-full shrink-0"></div>

        <div className="flex flex-1 justify-between">
          <div className="flex flex-col gap-1">
            <div className="skeleton w-12 h-2 rouded-full"></div>
            <div className="skeleton w-6 h-2 rounded-full"></div>
          </div>

          <div className="skeleton w-14 h-6 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default RightPanelSkeleton;