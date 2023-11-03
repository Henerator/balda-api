declare namespace mongodb {
  declare interface DeleteResult {
    /** Indicates whether this write result was acknowledged. If not, then all other members of this result will be undefined. */
    acknowledged: boolean;
    /** The number of documents that were deleted */
    deletedCount: number;
  }
}
