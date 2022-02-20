export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** An RFC-3339 compliant Full Date Scalar */
  Date: any;
  /** An RFC-3339 compliant DateTime Scalar */
  DateTime: any;
  DurationInSeconds: any;
  /** Long type */
  Long: any;
  /** A type representing a formatted java.util.UUID */
  UUID: any;
};

export type CreateUserRequestInput = {
  email: Scalars['String'];
  firstName: Scalars['String'];
  groupId?: InputMaybe<Scalars['Long']>;
  lastName: Scalars['String'];
  role: UserRole;
};

export type Example = {
  __typename?: 'Example';
  comment?: Maybe<Scalars['String']>;
  input: Scalars['String'];
  output: Scalars['String'];
};

export type ExampleInput = {
  comment?: InputMaybe<Scalars['String']>;
  input: Scalars['String'];
  output: Scalars['String'];
};

export type ExecutionErrorDescription = {
  __typename?: 'ExecutionErrorDescription';
  failReason: ProblemSolutionFailReason;
  message?: Maybe<Scalars['String']>;
  testCaseExecutionResult?: Maybe<TestCaseExecutionResult>;
};

export type ExecutionMetrics = {
  __typename?: 'ExecutionMetrics';
  maxMemoryUsage: Scalars['Long'];
  maxTime: Scalars['Long'];
};

export type ExecutionResult = {
  __typename?: 'ExecutionResult';
  error?: Maybe<ExecutionErrorDescription>;
  statistic?: Maybe<ExecutionMetrics>;
  testsPassed: Scalars['Boolean'];
};

export type Group = {
  __typename?: 'Group';
  id: Scalars['Long'];
  name: Scalars['String'];
  students: Array<User>;
  workAssignment?: Maybe<WorkGroupAssignment>;
  workAssignments: Array<WorkGroupAssignment>;
};


export type GroupWorkAssignmentArgs = {
  workId: Scalars['Long'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addUserToGroup: Group;
  createGroup: Group;
  login: SessionResponse;
  logout: Scalars['Boolean'];
  refreshToken: SessionResponse;
  registration: SessionResponse;
  saveGroupAssignments: Array<Scalars['Long']>;
  saveProblem: Problem;
  saveTestCases: Scalars['Long'];
  saveUser: User;
  saveWork: Work;
  saveWorkAssignments: Array<Scalars['Long']>;
  solveProblem: SolveProblemResponse;
  whoAmI: UserInfo;
};


export type MutationAddUserToGroupArgs = {
  groupId: Scalars['UUID'];
  userId: Scalars['UUID'];
};


export type MutationCreateGroupArgs = {
  updateGroupRequest: UpdateGroupRequestInput;
};


export type MutationLoginArgs = {
  signInRequest: SignInRequestInput;
};


export type MutationRegistrationArgs = {
  signUpRequest: SignUpRequestInput;
};


export type MutationSaveGroupAssignmentsArgs = {
  groupId: Scalars['Long'];
  workAssignments: Array<WorkAssignmentDtoInput>;
};


export type MutationSaveProblemArgs = {
  newProblem: ProblemUpdateDtoInput;
};


export type MutationSaveTestCasesArgs = {
  problemId: Scalars['Long'];
  testCases: Array<TestCaseDtoInput>;
};


export type MutationSaveUserArgs = {
  createUserRequest: CreateUserRequestInput;
};


export type MutationSaveWorkArgs = {
  workUpdateInput: WorkUpdateDtoInput;
};


export type MutationSaveWorkAssignmentsArgs = {
  workAssignments: Array<WorkAssignmentDtoInput>;
  workId: Scalars['Long'];
};


export type MutationSolveProblemArgs = {
  problemId: Scalars['Long'];
  solveProblemRequest: SolveProblemRequestInput;
};

export type PageSelectorClassInput = {
  currentPage: Scalars['Int'];
  pageSize: Scalars['Int'];
  sortDirIsDesc: Scalars['Boolean'];
  sortField: Scalars['String'];
};

export type PageSelectorInput = {
  currentPage: Scalars['Int'];
  pageSize: Scalars['Int'];
  sortDirIsDesc: Scalars['Boolean'];
  sortField: Scalars['String'];
};

export type Problem = {
  __typename?: 'Problem';
  author: User;
  examples: Array<Example>;
  id: Scalars['Long'];
  inLibrary: Scalars['Boolean'];
  name: Scalars['String'];
  tags: Array<Tag>;
  testCaseCount: Scalars['Long'];
  testCases: Array<TestCase>;
  text: Scalars['String'];
  userSolutionInfo?: Maybe<SolutionInfo>;
};


export type ProblemUserSolutionInfoArgs = {
  userId: Scalars['Long'];
};

export type ProblemSelectorInput = {
  authorId?: InputMaybe<Scalars['Long']>;
  excludeIds?: InputMaybe<Array<Scalars['Long']>>;
  inLibrary?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  tagIds?: InputMaybe<Array<Scalars['Long']>>;
};

export type ProblemSelectorWithPageInput = {
  pageSelector: PageSelectorInput;
  problemSelector: ProblemSelectorInput;
};

export enum ProblemSolutionFailReason {
  CompilationError = 'COMPILATION_ERROR',
  IncorrectOutput = 'INCORRECT_OUTPUT',
  MemoryLimitExceeded = 'MEMORY_LIMIT_EXCEEDED',
  TimeLimitExceeded = 'TIME_LIMIT_EXCEEDED'
}

export type ProblemUpdateDtoInput = {
  examples: Array<ExampleInput>;
  id: Scalars['Long'];
  inLibrary: Scalars['Boolean'];
  name: Scalars['String'];
  tags: Array<TagDtoInput>;
  text: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  group: Group;
  groups: Array<Group>;
  libraryProblem: Problem;
  libraryProblems: Array<Problem>;
  problem?: Maybe<Problem>;
  problemCount: Scalars['Long'];
  problems: Array<Problem>;
  submission: Submission;
  submissionCount: Scalars['Long'];
  submissionCountsByDates: Array<SubmissionCount>;
  submissions: Array<Submission>;
  tags: Array<Tag>;
  user: User;
  userCount: Scalars['Long'];
  users: Array<User>;
  work?: Maybe<Work>;
  workAssignments: Array<WorkGroupAssignment>;
  workCount: Scalars['Long'];
  workProblem?: Maybe<Problem>;
  works: Array<Work>;
};


export type QueryGroupArgs = {
  groupId: Scalars['Long'];
};


export type QueryLibraryProblemArgs = {
  id: Scalars['Long'];
};


export type QueryLibraryProblemsArgs = {
  page: Scalars['Int'];
  size: Scalars['Int'];
};


export type QueryProblemArgs = {
  problemId: Scalars['Long'];
};


export type QueryProblemCountArgs = {
  problemSelector: ProblemSelectorInput;
};


export type QueryProblemsArgs = {
  problemSelectorWithPage: ProblemSelectorWithPageInput;
};


export type QuerySubmissionArgs = {
  submissionId: Scalars['String'];
};


export type QuerySubmissionCountArgs = {
  selector: SubmissionSelectorInput;
};


export type QuerySubmissionCountsByDatesArgs = {
  end: Scalars['Date'];
  start: Scalars['Date'];
  userId: Scalars['Long'];
};


export type QuerySubmissionsArgs = {
  selector: SubmissionSelectorWithPageInput;
};


export type QueryUserArgs = {
  userId: Scalars['Long'];
};


export type QueryUserCountArgs = {
  selector: UserSelectorInput;
};


export type QueryUsersArgs = {
  selector: UserSelectorInput;
};


export type QueryWorkArgs = {
  id: Scalars['Long'];
};


export type QueryWorkAssignmentsArgs = {
  groupId: Scalars['Long'];
};


export type QueryWorkCountArgs = {
  workSelector: WorkSelectorInput;
};


export type QueryWorkProblemArgs = {
  problemId: Scalars['Long'];
  workId: Scalars['Long'];
};


export type QueryWorksArgs = {
  workSelectorWithPage: WorkSelectorWithPageInput;
};

export type SessionResponse = {
  __typename?: 'SessionResponse';
  jwtExpirationPeriod: Scalars['DurationInSeconds'];
  refreshTokenExpirationPeriod: Scalars['DurationInSeconds'];
  userInfo: UserInfo;
};

export type SignInRequestInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type SignUpRequestInput = {
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
};

export type SolutionInfo = {
  __typename?: 'SolutionInfo';
  status: SolutionStatus;
  tryCount: Scalars['Int'];
};

export enum SolutionStatus {
  Accepted = 'ACCEPTED',
  FailedTest = 'FAILED_TEST',
  NotSubmitted = 'NOT_SUBMITTED',
  RejectedByTeacher = 'REJECTED_BY_TEACHER',
  Testing = 'TESTING',
  ToTest = 'TO_TEST',
  VerifyingByTeacher = 'VERIFYING_BY_TEACHER'
}

export type SolveProblemRequestInput = {
  language: Scalars['String'];
  solutionText: Scalars['String'];
};

export type SolveProblemResponse = {
  __typename?: 'SolveProblemResponse';
  submissionId: Scalars['String'];
};

export type Submission = {
  __typename?: 'Submission';
  code: Scalars['String'];
  executionResult?: Maybe<ExecutionResult>;
  id: Scalars['String'];
  language: Scalars['String'];
  problem: Problem;
  problemId: Scalars['Long'];
  status: SubmissionStatus;
  submitted: Scalars['DateTime'];
  submitter: User;
  submitterId: Scalars['Long'];
};

export type SubmissionCount = {
  __typename?: 'SubmissionCount';
  count: Scalars['Long'];
  date: Scalars['Date'];
};

export type SubmissionSelectorInput = {
  from?: InputMaybe<Scalars['DateTime']>;
  languages?: InputMaybe<Array<Scalars['String']>>;
  problemIds?: InputMaybe<Array<Scalars['Long']>>;
  statuses?: InputMaybe<Array<SubmissionStatus>>;
  submitterIds?: InputMaybe<Array<Scalars['Long']>>;
  to?: InputMaybe<Scalars['DateTime']>;
};

export type SubmissionSelectorWithPageInput = {
  pageSelector: PageSelectorClassInput;
  submissionSelector: SubmissionSelectorInput;
};

export enum SubmissionStatus {
  Failed = 'FAILED',
  Succeed = 'SUCCEED',
  Testing = 'TESTING',
  ToTest = 'TO_TEST'
}

export type Subscription = {
  __typename?: 'Subscription';
  problemTestExecutions: TestExecutionEvent;
};


export type SubscriptionProblemTestExecutionsArgs = {
  problemId: Scalars['Long'];
};

export type Tag = {
  __typename?: 'Tag';
  id: Scalars['Long'];
  name: Scalars['String'];
};

export type TagDtoInput = {
  id: Scalars['Long'];
  name: Scalars['String'];
};

export type TestCase = {
  __typename?: 'TestCase';
  id: Scalars['Long'];
  input: Scalars['String'];
  outputs: Array<Scalars['String']>;
};

export type TestCaseDto = {
  __typename?: 'TestCaseDto';
  id: Scalars['Long'];
  input: Scalars['String'];
  outputs: Array<Scalars['String']>;
};

export type TestCaseDtoInput = {
  id: Scalars['Long'];
  input: Scalars['String'];
  outputs: Array<Scalars['String']>;
};

export type TestCaseExecutionResult = {
  __typename?: 'TestCaseExecutionResult';
  actualOutput: Scalars['String'];
  isSucceed: Scalars['Boolean'];
  memoryUsage?: Maybe<Scalars['Long']>;
  testCase: TestCaseDto;
  time?: Maybe<Scalars['Long']>;
};

export type TestExecutionEvent = {
  __typename?: 'TestExecutionEvent';
  problemId: Scalars['Long'];
  submissionId: Scalars['String'];
  submitterId: Scalars['Long'];
  type: TestExecutionEventType;
};

export enum TestExecutionEventType {
  CompilationFailed = 'COMPILATION_FAILED',
  StartExecution = 'START_EXECUTION',
  SubmissionFailed = 'SUBMISSION_FAILED',
  SubmissionPassed = 'SUBMISSION_PASSED',
  TestCaseFailed = 'TEST_CASE_FAILED',
  TestCaseSucceed = 'TEST_CASE_SUCCEED'
}

export type UpdateGroupRequestInput = {
  id?: InputMaybe<Scalars['Long']>;
  name: Scalars['String'];
  studentIds: Array<Scalars['Long']>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  firstName: Scalars['String'];
  group?: Maybe<Group>;
  id: Scalars['Long'];
  lastName: Scalars['String'];
  role: UserRole;
};

export type UserInfo = {
  __typename?: 'UserInfo';
  email: Scalars['String'];
  groupId?: Maybe<Scalars['Long']>;
  id: Scalars['Long'];
  role: UserRole;
};

export enum UserRole {
  Admin = 'ADMIN',
  Guest = 'GUEST',
  Student = 'STUDENT',
  Teacher = 'TEACHER'
}

export type UserSelectorInput = {
  course?: InputMaybe<Scalars['Int']>;
  currentPage: Scalars['Int'];
  excludeIds?: InputMaybe<Array<Scalars['Long']>>;
  groupName?: InputMaybe<Scalars['String']>;
  hasNoGroup?: InputMaybe<Scalars['Boolean']>;
  nameOrEmail?: InputMaybe<Scalars['String']>;
  pageSize: Scalars['Int'];
  roles?: InputMaybe<Array<UserRole>>;
  sortDirIsDesc: Scalars['Boolean'];
  sortField: Scalars['String'];
};

export type Work = {
  __typename?: 'Work';
  assignments: Array<WorkGroupAssignment>;
  author: User;
  end?: Maybe<Scalars['DateTime']>;
  id: Scalars['Long'];
  name: Scalars['String'];
  problems: Array<Problem>;
  start?: Maybe<Scalars['DateTime']>;
  type: WorkType;
};

export type WorkAssignmentDtoInput = {
  end?: InputMaybe<Scalars['DateTime']>;
  groupId?: InputMaybe<Scalars['Long']>;
  start?: InputMaybe<Scalars['DateTime']>;
  type: WorkType;
  workId?: InputMaybe<Scalars['Long']>;
};

export type WorkGroupAssignment = {
  __typename?: 'WorkGroupAssignment';
  end?: Maybe<Scalars['DateTime']>;
  group: Group;
  start?: Maybe<Scalars['DateTime']>;
  type: WorkType;
  work: Work;
};

export type WorkSelectorInput = {
  authorId?: InputMaybe<Scalars['Long']>;
  ended?: InputMaybe<Scalars['Boolean']>;
  excludeIds?: InputMaybe<Array<Scalars['Long']>>;
  name?: InputMaybe<Scalars['String']>;
  started?: InputMaybe<Scalars['Boolean']>;
  workTypes?: InputMaybe<Array<WorkType>>;
};

export type WorkSelectorWithPageInput = {
  pageSelector: PageSelectorInput;
  workSelector: WorkSelectorInput;
};

export enum WorkType {
  Classwork = 'CLASSWORK',
  Exam = 'EXAM',
  Homework = 'HOMEWORK'
}

export type WorkUpdateDtoInput = {
  end?: InputMaybe<Scalars['DateTime']>;
  id?: InputMaybe<Scalars['Long']>;
  name: Scalars['String'];
  problemIds: Array<Scalars['Long']>;
  start?: InputMaybe<Scalars['DateTime']>;
  type: WorkType;
};
