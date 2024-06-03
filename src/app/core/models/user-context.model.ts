export class UserContext {
  tenantId?: number;
  tenantName?: string;
  tenantShortName?: string;
  tenantLogoUrl?: string;
  userId?: number;
  branchCode?: string;
  displayName?: string;
  profilePicUrl?: string;
  loginId?: string;
  mobileNo?: string;
  emailId?: string;
  userType?: string;
  roleName?: string;
  privileges?: string[];

  constructor(tokenPayload: any) {
    this.tenantId = tokenPayload.tenant_id;
    this.tenantName = tokenPayload.tenant_name;
    this.tenantShortName = tokenPayload.tenant_short_name;
    this.tenantLogoUrl = tokenPayload.tenant_logo_url;
    this.userId = tokenPayload.user_id;
    this.branchCode = tokenPayload.branch_code;
    this.displayName = tokenPayload.displayname;
    this.profilePicUrl = tokenPayload.profile_pic_url;
    this.loginId = tokenPayload.login_id;
    this.mobileNo = tokenPayload.mobile_no;
    this.emailId = tokenPayload.email_id;
    this.userType = tokenPayload.user_type;
    this.roleName = tokenPayload.role_name;
    this.privileges = tokenPayload.privileges;
  }
}
