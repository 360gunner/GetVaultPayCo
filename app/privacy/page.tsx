import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Container from "@/components/Layout/Container";
import Stack from "@/components/Layout/Stack";
import Typography from "@/components/Typography/Typography";
import { responsiveFont } from "@/styles/responsive-font";
const PrivacyTitle: React.FC<{ title: string }> = ({ title }) => {
  return (
    <Typography
      as="p"
      font="Instrument Sans"
      weight={600}
      style={{ fontSize: 14, marginBottom: 0 }}
    >
      {title}
    </Typography>
  );
};
const PrivacyText: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Typography as="p" style={{ fontSize: 14 }}>
      {children}
    </Typography>
  );
};
const PrivacyPageH1: React.FC<{ children: string }> = ({ children }) => {
  return (
    <Typography
      as="h1"
      font="Space Grotesk"
      weight={400}
      style={{ fontSize: responsiveFont(80, 40) }}
    >
      {children}
    </Typography>
  );
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <Container
        size="lg"
        style={{
          paddingTop: 32,
          paddingBottom: 64,
          marginLeft: responsiveFont(26),
        }}
      >
        <PrivacyPageH1>Privacy Policy</PrivacyPageH1>
        <Container>
          <PrivacyText>Privacy Policy for Vault Pay</PrivacyText>
          <PrivacyText>Effective Date: 02/10/2024</PrivacyText>
          <PrivacyTitle title="1. Introduction" />
          {/* 1. Introduction */}
          <PrivacyText>
            This Privacy Policy explains how Vault Pay LLC ("we", "our", or
            "us") collects, uses, and shares information about you when you use
            our mobile application Vault Pay (the "App") available on the Google
            Play Store and through our website. By using the App, you agree to
            the collection and use of your information in accordance with this
            policy.
          </PrivacyText>
          {/* 2. Privacy Policy Availability */}
          <PrivacyTitle title="2. Privacy Policy Availability" />
          <PrivacyText>
            This Privacy Policy is available on our Vault Pay Google Play Store
            listing page and within the App itself under the [Settings/Info]
            section.
          </PrivacyText>
          {/* 3. Entity Reference */}
          <PrivacyTitle title="3. Entity Reference" />
          <PrivacyText>
            This policy applies to Vault Pay LLC, as listed on the Google Play
            Store under the developer Ali Younas for the app Vault Pay.
          </PrivacyText>
          {/* 4. Data Collection */}
          <PrivacyTitle title="4. Information We Collect" />
          <PrivacyText>
            We collect the following types of personal and sensitive data when
            you use the Vault Pay app: <br />
            1. App Info and Performance Crash logs, Diagnostics, and Other app
            performance data: We collect information about how the app performs
            on your device to improve the user experience. This may include
            crash reports, diagnostics, and other app-related data. <br /> 2.
            Personal Information Name, Email Address, Address, and Phone Number:
            We collect this information when you sign up for our services or
            interact with the app in ways that require you to provide personal
            details. This data may be used for account creation, communication,
            and customer support. <br /> 3. Device or Other IDs Device or Other
            IDs: We collect unique device identifiers to ensure a secure user
            experience, track app usage, and monitor app performance. <br /> 4.
            App Activity We collect information on your in-app activity, which
            may include interactions with features and other usage data, to
            provide and improve the app's functionality. <br /> 5. How We Use
            Your DataWe use the collected data for the following purposes: App
            functionality: To ensure proper operation of the app and its
            features. Performance optimization: To monitor and improve app
            performance, including crash reporting and diagnostics. Customer
            support: To assist you with any issues you may experience while
            using the app. Communication: To contact you regarding your account,
            app updates, or other important notifications. <br />
            6. Data Sharing We may share your data with third-party service
            providers who assist us with: Data storage and security. Analytics
            services for monitoring app performance and usage patterns. We do
            not sell your personal information to third parties. <br />
            7. Data Security We take reasonable measures to protect the personal
            data we collect from unauthorized access, use, or disclosure. These
            measures include encryption, access control, and secure data
            storage. <br />
            8. Data Retention and Deletion Policy We retain personal data for as
            long as necessary to provide the services and fulfill the purposes
            described in this policy. Users may request data deletion by
            contacting us through the methods listed below. <br />
            9. Contact Information If you have any questions or concerns about
            submit an inquiry regarding your personal information, please
            contact us at: Email: law@Vault Pay.com <br /> Mail: Vault Pay LLC,
            3790 EL CAMINO REAL PALO ALTO CA 94306
          </PrivacyText>
          <PrivacyTitle title="General Provisions"></PrivacyTitle>
          <PrivacyText>
            1. According to the Joint Controller Agreement No. 20180919 from
            April 19, 2023, your personal data controller is the Vault Pay
            network. Contact details for Vault Pay are available on the Vault
            Pay website. Contact details for the data protection officer
            authorized by Vault Pay: law@vaultpay.com. <br /> 2.Personal data
            collected by Vault Pay is processed in accordance with applicable
            legal protections for personal data. All employees, agents, and
            contractors of Vault Pay who know the secret of personal data must
            keep it secure even after termination of employment or contractual
            relationships. <br /> 3. Vault Pay, in accordance with applicable
            legal requirements, shall ensure the confidentiality of personal
            data and the implementation of appropriate technical and
            organizational measures to protect personal data from unauthorized
            access, disclosure, accidental loss, alteration, destruction, or
            other unlawful processing. <br /> 4. This Privacy Policy sets out
            the basic rules for the collection, storage, processing, and
            retention of your personal data, other information relating to you,
            the scope, purpose, sources, recipients, and other important aspects
            of your personal data when you use Vault Pay as a payment service
            provider. <br /> 5. By accessing and/or using the information on
            this website and/or our services, you acknowledge and confirm that
            you have read, understood, and agree to this Privacy Policy. Also,
            after you register with the system and start using our services,
            this Privacy Policy becomes a Supplement to the General Payment
            Services Agreement. <br /> 6. Vault Pay reserves the right, at its
            sole discretion, to modify this Privacy Policy at any time by
            publishing an updated version of the Privacy Policy on the website
            and, if the changes are substantial, notifying registered users by
            email. An amended or updated version of this Privacy Policy shall
            take effect upon its publishing on the website. <br /> 7. If the
            user of the services is a legal entity, this Privacy Policy applies
            to natural persons whose data is transmitted to us by the legal
            entity. The user shall inform the data subjects (managers,
            recipients, agents, etc.) of the transfer of their data to Vault Pay
            in accordance with applicable legal requirements.
          </PrivacyText>
          <PrivacyTitle title="Data Processing Purposes. Data Providers, Deadlines, Recipients" />{" "}
          <PrivacyText>
            1.The main purpose for which Vault Pay collects your personal data
            is to provide payment services to clients who send and receive
            payments. As a payment service provider, Vault Pay is bound by law
            to establish and verify your identity prior to entering into
            financial services transactions with you. At the time of providing
            services, Vault Pay may also request further information, as well as
            assess and store this information for the retention period set out
            by legislation. Taking this into account, you must provide correct
            and complete information. <br /> 2. PURPOSE: Client identification,
            provision of payment services (account opening, fund transfers,
            payment collection, and other services), and implementation of other
            legal obligations of the payment service provider. <br /> 3. 9.1.
            Personal data is processed for this purpose in compliance with legal
            requirements related to: <br /> 4. 9.1.1. Establishment and
            verification of the client’s identity; <br /> 5. 9.1.2. Conclusion
            and execution of agreements with the client or in order to take
            steps at the request of the client; <br /> 6. 9.1.3. Execution of
            fund transfers and transmission of the necessary information
            together with a transfer in accordance with legislation; <br /> 7.
            9.1.4. Implementation of "Know Your Client" requirements; <br /> 8.
            9.1.5. Continuous and periodic monitoring of the client’s activity;{" "}
            <br /> 9. 9.1.6. Risk assessment; <br /> 10. 9.1.7. Updating client
            data in order to ensure its accuracy; <br /> 11. 9.1.8. Prevention
            of possible money laundering and terrorist financing, prevention of
            fraud, detection, investigation, and informing of such activity;
            <br /> 12. 9.1.9. Ensuring proper risk and organization management.{" "}
            <br />
            13. 9.2. For this purpose, the following personal data may be
            processed: name, surname, national identification number, address,
            date of birth, a face photo, citizenship, data from an identity
            document and a copy of the document, direct video transmission
            recording, email address, phone number, current account number, IP
            address, current professional or work activity, current public
            function, and other data required by applicable legal acts. <br />{" "}
            14. 9.3. This personal data is collected and processed on the basis
            of a legal obligation imposed on the payment service provider and is
            required in order to open an account and/or provide a payment
            service. <br /> 15. 9.4. Data retention period: 10 (ten) years after
            the termination of the business relationship with the client. This
            personal data must be retained for 8 (eight) years according to
            applicable laws on the prevention of money laundering and terrorist
            financing. This data is retained for another 2 (two) years based on
            the legal interests of Vault Pay according to the ordinary
            limitation period of the lawsuit. <br />
            16. 9.5. Data providers and sources: the data subject directly,
            credit and other financial institutions and their branches, state
            and non-state registers, databases for checking the data of identity
            documents (databases of expired documents and other international
            databases), authority check registers, the Register of Incapacitated
            and Disabled Persons, the Population Register, other databases,
            companies processing consolidated debtor files, law enforcement
            agencies, legal entities (provided you are a representative,
            employee, founder, shareholder, contractor, or the real beneficiary
            of these legal entities), partners or other legal entities that
            engage us or are engaged by us in the provision of services, and
            other persons. <br /> 17. 9.6. Groups of data recipients:
            supervisory authorities, credit, financial, payment and/or
            electronic money institutions, pre-trial investigation institutions,
            state tax agencies, payment service representatives or partners of
            Vault Pay (if the transaction is carried out using their services),
            recipients of transaction funds receiving the information in payment
            statements, the recipient’s payment service providers and
            correspondents, participants, and/or parties related to national,
            European, African, and international payment systems, debt
            collection and recovery agencies, and other entities having a
            legitimate interest, under an agreement with Vault Pay or on other
            lawful bases.
            <br />
            10. PURPOSE: Debt management.
            <br />
            10.1. Personal data is processed to manage and collect debts, submit
            claims, and pursue legal action.
            <br />
            10.2. Data processed: name, surname, ID number, address, date of
            birth, ID document, email, phone, account number, IP, account
            statements, and other debt-related data.
            <br />
            10.3. Data retention: 10 years from the debt date, extended until
            repayment and for 24 months afterward, based on civil code
            limitations.
            <br />
            10.4. Data providers: subject directly, credit institutions,
            registers, debtor files (e.g., U.S. “Equifax”), other entities.
            <br />
            10.5. Data recipients: debtor file processors, financial
            institutions, lawyers, bailiffs, courts, tax agencies, and debt
            recovery agencies.
            <br />
            10.6. If debt is overdue for 30+ days, Vault Pay can share identity,
            contact, and credit history with debt databases and collection
            companies. Access your credit history through credit bureaus.
            <br />
            11. PURPOSE: Client relations and dispute prevention.
            <br />
            11.1. Personal data is processed to maintain business relationships,
            protect interests, prevent disputes, and assess service quality.
            <br />
            11.2. Data processed: name, surname, address, date of birth, email,
            phone, IP, account statements, call recordings, and correspondence.
            <br />
            11.3. Data retention: 5 years after the business relationship ends,
            extendable by 2 years upon request from authorities.
            <br />
            11.4. Data providers: subject directly.
            <br />
            11.5. Data recipients: supervisory authorities, debtor file
            processors, courts, tax agencies, debt recovery agencies, and others
            under agreement with Vault Pay.
            <br />
            PURPOSE: Credit rating assessment, credit risk management, and
            automated decision making.
            <br />
            12.1. The personal data for this purpose is processed to assess the
            creditworthiness of clients, to manage the credit risk, and to meet
            the requirements related to operational risk management and capital
            adequacy, so that Vault Pay can offer to provide funding.
            <br />
            12.2. The following personal data may be processed for this purpose:
            name, surname, address, date of birth, email address, telephone
            number, payment account number, IP address, payment account
            statements, client's balance on the account, financial liabilities,
            credit and payment history, income, education, workplace, current
            work position, work experience, available assets, and data on
            relatives, and other information.
            <br />
            12.3. Data retention period: 10 (ten) years after the termination of
            the business relationship with the client.
            <br />
            12.4. Data recipients: credit, financial, payment and/or electronic
            money institutions or service providers assisting in the assessment
            of creditworthiness, and companies processing consolidated debtor
            files.
            <br />
            12.6. In order to conclude or offer to enter into a funding
            agreement with you and to provide you with services, Vault Pay will,
            in certain cases, apply decision-making based on the automated
            processing of your personal data. In this case, the system checks
            your creditworthiness with a set algorithm and assesses whether the
            service can be provided. If the automated decision is negative, it
            may be changed by the client providing more data. Vault Pay takes
            all the necessary measures to protect your rights, freedoms, and
            legitimate interests. You have the right to demand human
            intervention, express your opinion, and challenge an automated
            decision. You have the right to oppose an automated decision by
            contacting Vault Pay directly.
            <br />
            PURPOSE: Protection of interests of Vault Pay and the client (video
            surveillance on the premises of Vault Pay).
            <br />
            13.1. Personal data for this purpose is processed in order to ensure
            the security of Vault Pay and/or the client, to protect the life and
            health of the client and/or their representative, and other rights
            of Vault Pay and the client (video surveillance and recording in the
            premises of Vault Pay) in pursuit of the legitimate interest to
            protect clients, employees, and visitors of Vault Pay and their
            property, as well as the property of Vault Pay.
            <br />
            13.2. For this purpose, the following personal data may be
            processed: video recordings on the premises managed by Vault Pay.
            <br />
            13.3. Before entering the premises of Vault Pay where video
            surveillance is conducted, you are informed about the surveillance
            by special markings.
            <br />
            13.4. Data retention period: 1 (one) year.
            <br />
            13.5. Data providers: the data subject directly who visits the
            premises of Vault Pay where video surveillance is conducted and is
            captured by the surveillance camera.
            <br />
            13.6. Data recipients: courts, pre-trial investigation institutions,
            lawyers (only in case of an attempt to attack).
            <br />
            1.PURPOSE: Informing the client about services.
            <br />
            14.1. Personal data for this purpose is processed in order to inform
            the client about the services provided by Vault Pay, their prices,
            specifics, changes in the terms of the agreements concluded with the
            client, and for sending system and other messages relating to the
            provided Vault Pay services.
            <br />
            14.2. The following personal data may be processed for this purpose:
            email address, phone number.
            <br />
            14.3. The data subject confirms that they are aware that such
            messages are necessary for the execution of the General Payment
            Services Agreement and/or its supplements concluded with the client,
            and they are not considered to be direct marketing messages.
            <br />
            14.4. Data retention period: 24 (twenty-four) months after the
            termination of the business relationship with the client.
            <br />
            14.5. Data providers: the data subject directly.
            <br />
            14.6. Data recipients: the data for this purpose is not provided to
            other persons.
            <br />
            1.PURPOSE: Direct marketing.
            <br />
            15.1. For this purpose, personal data is processed in order to
            provide clients with offers on the services provided by Vault Pay
            and find out the clients' opinions on the above-mentioned services.
            <br />
            15.2. The following personal data may be processed for this purpose:
            name, surname, email address, and phone number.
            <br />
            15.3. For this purpose, Vault Pay sends newsletters and direct
            marketing messages after obtaining the client's consent. Vault Pay
            may use a newsletter service provider while ensuring that said
            provider complies with the personal data protection requirements set
            out in the Joint Controller Agreement. The client may revoke their
            consent upon receiving newsletters or direct marketing messages by
            clicking on the Revoke your consent link as well as informing Vault
            Pay at any time about their refusal to process personal data for
            direct marketing purposes by e-mail support@VaultPay.com.
            <br />
            15.4. Data retention period: until the termination of the business
            relationship with the client or until the day the client objects to
            the data processing for this purpose.
            <br />
            15.5. Data providers: the data subject directly.
            <br />
            15.6. Data recipients: The data for this purpose may be transmitted
            to search or social networking systems (the possibility to object
            data processing is ensured by the websites of these systems),
            newsletter service providers.
            <br />
            1.PURPOSE: Statistical analysis. Your personal data collected for
            the aforementioned purposes, except for the national identification
            number, identity documents and their details, also the exact place
            of residence, may be processed for the purpose of statistical
            analysis. For this purpose, personal data shall be processed in such
            a way that, by including it in the scope of statistical analysis, it
            is not possible to identify the data subjects concerned. The
            collection of your personal data for the purpose of statistical
            analysis is based on the legitimate interest to analyse, improve,
            and develop the conducted activity. You have the right to disagree
            and object to your personal data processing for such purpose at any
            time and in any form by informing Vault Pay thereof. However, Vault
            Pay may continue to process the data for statistical purposes if it
            proves that the data is processed for compelling legitimate reasons
            beyond the interests, rights, and freedoms of the data subject or
            for the establishment, exercise, or defence of legal claims.
            <br />
            2.PURPOSE: Service improvement. The data collected for all of the
            above purposes can be used to improve technical and organisational
            tools, IT infrastructure, adapt services to the devices used,
            develop new Vault Pay services, enhance satisfaction with existing
            services, as well as test and improve technical tools and IT
            infrastructure.
            <br />
            3.PURPOSE: Service misuse prevention and proper service delivery.
            The data collected for all of the above purposes may be used to
            prevent unauthorised access and use, i.e. to ensure privacy and
            information security.
            <br />
            4.For the processing of personal data, Vault Pay may engage data
            processors and/or, at its own discretion, hire other persons to
            perform certain ancillary functions on behalf of Vault Pay (e.g.
            data centres, hosting, cloud hosting, system administration, system
            development, software development, provision, support services such
            as improvement and development; services of customer service
            centres; marketing, communication, consulting, temporary staffing,
            or similar services). In such cases, Vault Pay shall take the
            necessary measures to ensure that such data processors process
            personal data in accordance with Vault Pay's instructions and
            applicable laws, and shall require compliance with the appropriate
            personal data security measures. Vault Pay shall also ensure that
            such persons are bound by confidentiality obligations and cannot use
            such information for any purpose other than the performance of their
            functions.
            <br />
            5.Personal data collected for the purposes specified in this Privacy
            Policy shall not be processed in any ways incompatible with these
            legitimate purposes or legal requirements.
            <br />
            6.The data referred to above will be provided and received through a
            software tool used by Vault Pay or its authorised agent, also by
            other means and third persons with whom Vault Pay has entered into
            personal data processing agreements in accordance with laws and
            regulations.
          </PrivacyText>
          <PrivacyText>
            Geographical area of processing
            <br />
            1.Generally, personal data is processed within the African
            continents/ European Union/European Economic Area (EU/EEA) but may
            in certain cases be transmitted and processed outside the EU/EEA.
            <br />
            2.Personal data may be transferred and processed outside the EU/EEA
            where the transfer is necessary for the conclusion or execution of a
            contract (for example, when a payment is carried out to a third
            party or through a third party partner (correspondent)) or for
            example, when the client carries out commerce activities using an
            online platform (is a registered user) where payment service
            providers of registered users are subject to specific customer
            information requirements when law provisions stipulate the need for
            the transfer, or when the client gave their consent. We seek to
            ensure that appropriate technical and organisational measures are in
            place in all of these cases as indicated in the Joint Controller
            Agreement.
            <br />
            Profiling 1.Profiling carried out by Vault Pay involves the
            processing of personal data by automated means for the purposes of
            legislation relating to risk management and continuous and periodic
            monitoring of transactions in order to prevent fraud; such ongoing
            profiling is based on the legal obligations of Vault Pay.
            <br />
            2.For the purpose of direct marketing and statistical analysis,
            profiling may be carried out using Matomo, Google, Facebook, and
            other analytics tools.
            <br />
            Processing the personal data of minors 1.A minor under 14 (fourteen)
            years of age, seeking to use the payment services of Vault Pay,
            shall provide written consent from their representative (parent or
            legal guardian) with regard to their personal data processing.
            <br />
          </PrivacyText>
          <PrivacyText>
            Cookie policy
            <br />
            1. Vault Pay may use cookies on this website. Cookies are small
            files sent to a person's Internet browser and stored on their
            device. Cookies are transferred to a personal computer upon first
            visiting the website.
            <br />
            2.Usually, Vault Pay uses only the necessary cookies on the person's
            device for identification, enhancement of the website functionality
            and use, and facilitating a person's access to the website and the
            information it contains. Vault Pay may use other cookies upon
            receiving the client's consent. You will find a brief description of
            different types of cookies here: - Strictly necessary cookies. These
            cookies are essential for the website to function and cannot be
            turned off in the Vault Pay system. They are usually set in response
            to actions taken by you, like setting your privacy preferences,
            logging in, or filling in forms.
            <br />
            - Performance cookies. These cookies allow the website to count
            visits and traffic sources so that Vault Pay can measure and improve
            the performance of the website. They help Vault Pay to know which
            pages are the most and least popular and see how visitors move
            around the site.
            <br />
            - Functional cookies. These cookies enable the website to provide
            enhanced functionality and personalization. They may be set by Vault
            Pay or by third-party providers whose services have been added to
            the pages of Vault Pay. If you do not allow these cookies, some or
            all of these services may not function properly.
            <br />
            - Targeting cookies. These cookies may be set through Vault Pay's
            site by its advertising partners. They may be used by those
            companies to build a profile of your interests and show you relevant
            ads on other sites. They do not store directly personal information,
            but they are based on uniquely identifying your browser and device.
            <br />- Social media cookies. These cookies are set by a range of
            social media services that are added to the site to enable you to
            share our content with your friends and networks. They can track
            your browser across other sites and build a profile of your
            interests. This can impact the content and messages you see on other
            sites you visit.
          </PrivacyText>
          <PrivacyText>
            1.You can set your browser to refuse cookies or to alert you when
            cookies are being sent. However, if you do not accept cookies, you
            may not be able to use some features of the Vault Pay service.
            <br /> 2.Your browser may also allow you to delete cookies. If you
            want to delete cookies, you will need to do this separately for each
            browser and device you use.
          </PrivacyText>
        </Container>
      </Container>
      <Footer />
    </>
  );
}
